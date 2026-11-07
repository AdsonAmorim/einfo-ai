import "dotenv/config";
import { prisma } from "../src/index";

const categories = [
  { name: "Processadores", slug: "processadores" },
  { name: "Placas de vídeo", slug: "placas-de-video" },
  { name: "Memória RAM", slug: "memoria-ram" },
  { name: "Armazenamento", slug: "armazenamento" },
  { name: "Periféricos", slug: "perifericos" },
  { name: "Monitores", slug: "monitores" },
];

const products: Array<{
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  stock: number;
  category: string;
}> = [
  { name: "AMD Ryzen 7 7800X3D", slug: "amd-ryzen-7-7800x3d", description: "8 núcleos, 16 threads, 96MB de cache L3 com 3D V-Cache. Socket AM5.", priceCents: 239990, stock: 12, category: "processadores" },
  { name: "AMD Ryzen 5 7600", slug: "amd-ryzen-5-7600", description: "6 núcleos, 12 threads, até 5.1GHz. Acompanha cooler Wraith Stealth.", priceCents: 119990, stock: 25, category: "processadores" },
  { name: "Intel Core i5-14600K", slug: "intel-core-i5-14600k", description: "14 núcleos (6P + 8E), 20 threads, até 5.3GHz. Socket LGA1700.", priceCents: 179990, stock: 8, category: "processadores" },
  { name: "Intel Core i9-14900K", slug: "intel-core-i9-14900k", description: "24 núcleos (8P + 16E), 32 threads, até 6.0GHz.", priceCents: 349990, stock: 0, category: "processadores" },
  { name: "NVIDIA GeForce RTX 4070 Super 12GB", slug: "rtx-4070-super-12gb", description: "12GB GDDR6X, DLSS 3, ray tracing de 3ª geração.", priceCents: 449990, stock: 6, category: "placas-de-video" },
  { name: "AMD Radeon RX 7800 XT 16GB", slug: "rx-7800-xt-16gb", description: "16GB GDDR6, ótima para 1440p.", priceCents: 399990, stock: 4, category: "placas-de-video" },
  { name: "NVIDIA GeForce RTX 4060 8GB", slug: "rtx-4060-8gb", description: "8GB GDDR6, eficiente e silenciosa para 1080p.", priceCents: 199990, stock: 15, category: "placas-de-video" },
  { name: "Kingston Fury Beast 32GB (2x16) DDR5 6000MHz", slug: "kingston-fury-beast-32gb-ddr5", description: "Kit dual channel DDR5, CL36, perfil XMP/EXPO.", priceCents: 79990, stock: 30, category: "memoria-ram" },
  { name: "Corsair Vengeance 16GB (2x8) DDR4 3200MHz", slug: "corsair-vengeance-16gb-ddr4", description: "Kit DDR4 CL16 com dissipador de alumínio.", priceCents: 29990, stock: 40, category: "memoria-ram" },
  { name: "SSD Samsung 990 Pro 1TB NVMe", slug: "ssd-samsung-990-pro-1tb", description: "PCIe 4.0, até 7450MB/s de leitura.", priceCents: 69990, stock: 20, category: "armazenamento" },
  { name: "SSD Kingston NV2 2TB NVMe", slug: "ssd-kingston-nv2-2tb", description: "PCIe 4.0, até 3500MB/s. Ótimo custo-benefício.", priceCents: 79990, stock: 18, category: "armazenamento" },
  { name: "HD Seagate BarraCuda 2TB", slug: "hd-seagate-barracuda-2tb", description: "7200RPM, SATA III, 256MB de cache.", priceCents: 39990, stock: 3, category: "armazenamento" },
  { name: "Teclado Mecânico Redragon Kumara", slug: "teclado-redragon-kumara", description: "Switch Outemu Blue, layout ABNT2, iluminação vermelha.", priceCents: 19990, stock: 50, category: "perifericos" },
  { name: "Mouse Logitech G Pro X Superlight 2", slug: "mouse-logitech-g-pro-x-superlight-2", description: "Sem fio, 60g, sensor HERO 2 32K DPI.", priceCents: 89990, stock: 10, category: "perifericos" },
  { name: "Headset HyperX Cloud II", slug: "headset-hyperx-cloud-ii", description: "Som surround 7.1 virtual, microfone removível.", priceCents: 49990, stock: 22, category: "perifericos" },
  { name: "Mousepad Logitech G640 Grande", slug: "mousepad-logitech-g640", description: "Superfície de tecido, 46 x 40 cm.", priceCents: 14990, stock: 35, category: "perifericos" },
  { name: "Webcam Logitech C920 Full HD", slug: "webcam-logitech-c920", description: "1080p a 30fps, microfones estéreo.", priceCents: 39990, stock: 0, category: "perifericos" },
  { name: 'Monitor LG UltraGear 27" 144Hz IPS', slug: "monitor-lg-ultragear-27-144hz", description: "27 polegadas, Full HD, 1ms, HDR10, FreeSync Premium.", priceCents: 129990, stock: 9, category: "monitores" },
  { name: 'Monitor Samsung Odyssey G5 32" QHD Curvo', slug: "monitor-samsung-odyssey-g5-32", description: "32 polegadas, 2560x1440, 165Hz, curvatura 1000R.", priceCents: 199990, stock: 5, category: "monitores" },
  { name: 'Monitor Dell 24" P2423D QHD', slug: "monitor-dell-24-p2423d", description: "24 polegadas, 2560x1440, IPS, ajuste de altura.", priceCents: 149990, stock: 7, category: "monitores" },
];

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const bySlug = new Map<string, string>();
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    bySlug.set(c.slug, created.id);
  }

  for (const { category, ...p } of products) {
    await prisma.product.create({ data: { ...p, categoryId: bySlug.get(category)! } });
  }

  console.log(`Seed: ${categories.length} categorias, ${products.length} produtos`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
