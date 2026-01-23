
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const barbershopsToCreate = [
  {
    name: "Barbearia Rio Verde",
    address: "Rua Presidente Vargas, 100",
    city: "Rio Verde",
    state: "GO",
    description: "A melhor barbearia de Rio Verde. Tradição e qualidade no coração de Goiás.",
    imageUrl: "https://utfs.io/f/c97a2dc9-cf62-468b-a851-bfd2bdde775f-16p.png", // Vintage
    latitude: -17.7915,
    longitude: -50.9197,
    phones: ["(64) 99999-1111"],
  },
  {
    name: "Cuiabá Barber Club",
    address: "Av. do CPA, 200",
    city: "Cuiabá",
    state: "MT",
    description: "O calor de Cuiabá pede um corte refrescante. Venha conhecer nosso espaço climatizado.",
    imageUrl: "https://utfs.io/f/45331760-899c-4b4b-910e-e00babb6ed81-16q.png", // Modern
    latitude: -15.6014,
    longitude: -56.0979,
    phones: ["(65) 98888-2222"],
  },
  {
    name: "Floripa Cuts",
    address: "Av. Beira Mar Norte, 300",
    city: "Florianópolis",
    state: "SC",
    description: "Estilo e sofisticação na Ilha da Magia. Profissionais especializados em cortes modernos.",
    imageUrl: "https://utfs.io/f/2f9278ba-3975-4026-af46-64af78864494-16u.png", // Clean
    latitude: -27.5954,
    longitude: -48.5480,
    phones: ["(48) 97777-3333"],
  },
];

const services = [
  {
    name: "Corte de Cabelo",
    description: "Estilo personalizado",
    priceInCents: 5000, // 50.00
    imageUrl: "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
  },
  {
    name: "Barba",
    description: "Modelagem completa",
    priceInCents: 4000, // 40.00
    imageUrl: "https://utfs.io/f/e6bdffb6-24a9-455b-aba3-903c2c2b5bde-1jo6tu.png",
  },
  {
    name: "Corte + Barba",
    description: "Pacote completo",
    priceInCents: 8500, // 85.00
    imageUrl: "https://utfs.io/f/8a457cda-f768-411d-a737-cdb23ca6b9b5-b3pegf.png",
  },
];

async function main() {
    console.log("Starting specific seed...");
    
    for (const b of barbershopsToCreate) {
        const barbershop = await prisma.barbershop.create({
            data: {
                name: b.name,
                address: b.address,
                city: b.city,
                state: b.state,
                description: b.description,
                imageUrl: b.imageUrl,
                latitude: b.latitude,
                longitude: b.longitude,
                phones: b.phones,
            }
        });
        
        console.log(`Created barbershop: ${b.name} (${b.city}/${b.state})`);

        for (const s of services) {
            await prisma.barbershopService.create({
                data: {
                    name: s.name,
                    description: s.description,
                    priceInCents: s.priceInCents,
                    imageUrl: s.imageUrl,
                    barbershopId: barbershop.id
                }
            });
        }
    }
    
    console.log("Seeding finished.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
