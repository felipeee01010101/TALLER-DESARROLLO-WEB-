const express = require("express");
const router = express.Router();
const Order = require("../models/Order"); // Modelo de Pedido
const Product = require("../models/Product"); // Modelo de Producto
const Invoice = require("../models/Invoice"); // Modelo de Boleta

// Crear un pedido y generar boleta
router.post("/checkout", async (req, res) => {
  try {
    const { cliente, envio, items, medioPago, total } = req.body;

    //  guarda los items con el nombre del producto
    const itemsProcesados = [];

    // Valida stock y obteniene nombres de productos
    for (const item of items) {
      const prod = await Product.findById(item.productId);
      if (!prod) return res.status(404).json({ error: `Producto ${item.productId} no encontrado` });
      
      if (prod.stock < item.qty) {
        return res.status(400).json({ error: `Stock insuficiente para ${prod.nombre}` });
      }

      // Guardamos la info completa para usarla al crear la Orden
      itemsProcesados.push({
        producto: item.productId,
        nombre: prod.nombre, 
        cantidad: item.qty,
        precio: item.precio
      });
    }

    // 2. Crear la orden en MongoDB
    const nuevaOrden = await Order.create({
      cliente,
      items: itemsProcesados, 
      total,
      estado: 'pagado', 
      metodoPago: medioPago || 'webpay'
    });

    // 3. Descontar stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } });
    }

    // inicio boleta
    
    // Cálculos de IVA (19%)
    const valorNeto = Math.round(total / 1.19);
    const valorIva = total - valorNeto;
    
    // Generar Folio 
    const folioBoleta = `BOL-${Date.now()}`;

    // Crear la Boleta
    const nuevaBoleta = await Invoice.create({
      order: nuevaOrden._id,
      folio: folioBoleta,
      receptor: {
        nombre: cliente.nombre,
        email: cliente.email,
        direccion: cliente.direccion,
        telefono: cliente.telefono
      },
      detalle: itemsProcesados.map(item => ({
        nombreProducto: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        totalLinea: item.cantidad * item.precio
      })),
      montos: {
        neto: valorNeto,
        iva: valorIva,
        total: total
      }
    });

    

    // 4. Responder con éxito
    res.status(201).json({
      message: "Pedido creado y boleta generada exitosamente",
      orderId: nuevaOrden._id,
      invoiceId: nuevaBoleta._id, // Devolvemos el ID de la boleta
      folio: nuevaBoleta.folio,
      paymentUrl: `https://webpay.cl/pagar/${nuevaOrden._id}`
    });

  } catch (error) {
    console.error("Error al crear orden:", error);
    res.status(500).json({ error: "Error al procesar el pedido" });
  }
});

//  Consultar estado de un pedido
router.get("/:id", async (req, res) => {
  try {
    const orden = await Order.findById(req.params.id).populate('items.producto');
    if (!orden) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(orden);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//  Ver boleta visualmente (HTML)
router.get("/invoice/:id", async (req, res) => {
  try {
    const boleta = await Invoice.findById(req.params.id);
    if (!boleta) return res.status(404).send("<h1>Boleta no encontrada</h1>");

    // Formatear fecha
    const fecha = new Date(boleta.fechaEmision).toLocaleString('es-CL');

    // Generar filas de productos HTML
    const filasProductos = boleta.detalle.map(item => `
      <tr>
        <td>${item.nombreProducto}</td>
        <td style="text-align: center;">${item.cantidad}</td>
        <td style="text-align: right;">$${item.precioUnitario.toLocaleString('es-CL')}</td>
        <td style="text-align: right;">$${(item.totalLinea).toLocaleString('es-CL')}</td>
      </tr>
    `).join('');

    // Plantilla HTML de la Boleta
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Boleta ${boleta.folio}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #fdfbf7; padding: 40px; }
          .invoice-box {
            max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); background: white;
          }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
          .logo { font-size: 24px; font-weight: bold; color: #ff7f50; } /* Tu color Naranja */
          .info { text-align: right; color: #555; }
          
          table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
          table td { padding: 10px; vertical-align: top; }
          table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
          table tr.item td { border-bottom: 1px solid #eee; }
          table tr.total td { border-top: 2px solid #333; font-weight: bold; }
          
          .status-paid { 
            color: #2ecc71; border: 2px solid #2ecc71; padding: 5px 10px; 
            border-radius: 5px; font-weight: bold; text-transform: uppercase; display: inline-block; margin-top: 10px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div class="logo">🍣 Poké Fresh</div>
            <div class="info">
              Folio: <strong>${boleta.folio}</strong><br>
              Fecha: ${fecha}<br>
              <div class="status-paid">Pagado</div>
            </div>
          </div>

          <table cellpadding="0" cellspacing="0">
            <tr class="heading">
              <td>Receptor</td>
              <td>Datos de Contacto</td>
            </tr>
            <tr class="details">
              <td>${boleta.receptor.nombre}</td>
              <td>
                ${boleta.receptor.email}<br>
                ${boleta.receptor.direccion}
              </td>
            </tr>
          </table>

          <br>

          <table cellpadding="0" cellspacing="0">
            <tr class="heading">
              <td>Producto</td>
              <td style="text-align: center;">Cant.</td>
              <td style="text-align: right;">Precio Unit.</td>
              <td style="text-align: right;">Total</td>
            </tr>

            ${filasProductos}

            <tr class="total">
              <td colspan="3" style="text-align: right; padding-top: 20px;">Neto:</td>
              <td style="text-align: right; padding-top: 20px;">$${boleta.montos.neto.toLocaleString('es-CL')}</td>
            </tr>
            <tr class="total">
              <td colspan="3" style="text-align: right;">IVA (19%):</td>
              <td style="text-align: right;">$${boleta.montos.iva.toLocaleString('es-CL')}</td>
            </tr>
            <tr class="total" style="font-size: 1.2em; color: #ff7f50;">
              <td colspan="3" style="text-align: right;">TOTAL:</td>
              <td style="text-align: right;">$${boleta.montos.total.toLocaleString('es-CL')}</td>
            </tr>
          </table>
          
          <div style="margin-top: 40px; text-align: center; font-size: 0.8em; color: #aaa;">
            Gracias por preferir Poké Fresh. Documento tributario electrónico generado automáticamente.
          </div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;

    res.send(html);

  } catch (error) {
    res.status(500).send("Error generando la boleta visual");
  }
});

// Actualizar estado (Para Cocina/Admin)
router.put("/:id/status", async (req, res) => {
  try {
    const { estado } = req.body; // Esperamos recibir { estado: 'en_camino' }
    
    const orden = await Order.findByIdAndUpdate(
      req.params.id, 
      { estado: estado },
      { new: true } // Para devolver el objeto actualizado
    );

    if (!orden) return res.status(404).json({ error: "Orden no encontrada" });
    
    res.json({ message: `Estado actualizado a ${estado}`, orden });
  } catch (error) {
    res.status(500).json({ error: "Error actualizando el pedido" });
  }
});

//  Obtener solo pedidos activos para la cocina
router.get("/kitchen/pending", async (req, res) => {
  try {
    // Buscamos pedidos que NO estén anulados ni entregados
    const ordenes = await Order.find({ 
      estado: { $nin: ['entregado', 'anulado'] } 
    }).sort({ fecha: 1 }); // Los más antiguos primero (FIFO)
    
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 