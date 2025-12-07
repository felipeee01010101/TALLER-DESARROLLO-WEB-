const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/catalog
router.get("/", async (req, res) => {
  try {
    const { categoria } = req.query;
    let filtro = { disponible: true };
    if (categoria && categoria !== 'todos') filtro.categorias = categoria;
    const productos = await Product.find(filtro);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener catálogo", error: error.message });
  }
});

// POST /api/catalog/seed
router.post("/seed", async (req, res) => {
  try {
    const dataInicial = [
      // --- BOWLS ---
      { 
        nombre: "Bowl Clásico", 
        precio: 6990, 
        categorias: ["bowls"], 
        desc: "Arroz sushi, salmón, palta, pepino, sésamo.", 
        img: "https://yogarespiraprofundo.es/wp-content/uploads/2021/03/poke-bowl-salmon.jpg", 
        stock: 50 
      },
      { 
        nombre: "Bowl Vegano", 
        precio: 6490, 
        categorias: ["bowls","veganos"], 
        desc: "Quinoa, tofu, edamame, palta, kale.", 
        img: "https://hips.hearstapps.com/hmg-prod/images/aloha-poke-2-1600955569.jpg?crop=1.00xw:0.667xh;0,0.138xh&resize=640:*", 
        stock: 30 
      },
      { 
        nombre: "Bowl Proteico", 
        precio: 7290, 
        categorias: ["bowls","proteicos"], 
        desc: "Arroz integral, pollo grillado, brócoli.", 
        // IMAGEN NUEVA: Bowl con pollo
        img: "https://d36fw6y2wq3bat.cloudfront.net/recipes/bowl-de-arroz-con-pollo-y-brocoli/900/bowl-de-arroz-con-pollo-y-brocoli_version_1652879220.jpg", 
        stock: 40 
      },
      { 
        nombre: "Bowl Atún Picante", 
        precio: 7590, 
        categorias: ["bowls"], 
        desc: "Arroz sushi, atún, sriracha mayo, cebollín.", 
        img: "https://es.cravingsjournal.com/wp-content/uploads/2022/11/poke-bowl-con-mayonesa-picante-3-480x270.jpg", 
        stock: 20 
      },
      
      // --- SNACKS ---
      { 
        nombre: "Snack Edamame", 
        precio: 2490, 
        categorias: ["snacks", "veganos"], 
        desc: "Edamame al vapor con sal marina.", 
        img: "https://tofuu.getjusto.com/orioneat-local/resized2/TkquZfTH4KSs6b73g-2400-x.webp", 
        stock: 100 
      },
      { 
        nombre: "Snack Mix de Frutos", 
        precio: 2990, 
        categorias: ["snacks"], 
        desc: "Almendras, nueces y cranberries.", 
        // IMAGEN NUEVA: Mix de frutos secos
        img: "https://cdnx.jumpseller.com/eco-tienda-pewen/image/30706812/MIX-PREMIUM-3.jpg?1701743893", 
        stock: 100 
      },

      // --- BEBIDAS ---
      { 
        nombre: "Limonada Menta Jengibre", 
        precio: 2500, 
        categorias: ["bebidas"], 
        desc: "Refrescante, natural y recién hecha.", 
        img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80", 
        stock: 50 
      },
      { 
        nombre: "Jugo Mango Maracuyá", 
        precio: 2800, 
        categorias: ["bebidas"], 
        desc: "Tropical y dulce, sin azúcar añadida.", 
        img: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80", 
        stock: 40 
      },
      { 
        nombre: "Té Helado Casero", 
        precio: 1990, 
        categorias: ["bebidas"], 
        desc: "Té negro con limón y miel.", 
        img: "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=800&q=80", 
        stock: 80 
      },
      { 
        nombre: "Agua Mineral Sin Gas", 
        precio: 1290, 
        categorias: ["bebidas"], 
        desc: "Botella 500ml.", 
        img: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80", 
        stock: 100 
      },
      { 
        nombre: "Kombucha Original", 
        precio: 3500, 
        categorias: ["bebidas"], 
        desc: "Bebida probiótica fermentada.", 
        // IMAGEN DE KOMBUCHA SOLICITADA
        img: "https://aldeanativa.cl/cdn/shop/files/kombucha-original-kombuchacha-500-ml-kombuchacha-aldea-nativa-450741.jpg?v=1718729697", 
        stock: 25 
      }
    ];

    await Product.deleteMany({}); 
    await Product.insertMany(dataInicial);
    res.json({ message: "Datos cargados correctamente en MongoDB" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;