
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Helper to remove accents
const removeAccents = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

// Helper to Title Case
const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

async function main() {
  console.log("🏙️ Iniciando normalização de cidades...")

  const barbershops = await prisma.barbershop.findMany()
  
  // Group by normalized slug
  const groups: Record<string, string[]> = {} // slug -> original names
  
  barbershops.forEach(b => {
      if (!b.city) return
      const slug = removeAccents(b.city.trim().toLowerCase())
      if (!groups[slug]) groups[slug] = []
      if (!groups[slug].includes(b.city)) groups[slug].push(b.city)
  })

  // Process groups
  for (const slug in groups) {
      const variants = groups[slug]
      
      // Determine best name: Prefer one with Non-ASCII (accents) and Title Case
      // Or just take the one that looks "most formatted"
      // Simple heuristic: Sort by length (sometimes accented is same length), then by having accents
      
      let bestName = variants[0]
      
      // Try to find a variant with accents
      const withAccents = variants.find(v => v !== removeAccents(v))
      if (withAccents) {
          bestName = withAccents
      }
      
      // Enforce Title Case on the chosen name
      const finalName = titleCase(bestName)
      
      console.log(`Processing group '${slug}': [${variants.join(", ")}] -> Unifying to '${finalName}'`)

      // Update all barbershops in this group
      // We look for barbershops whose normalized city matches the slug
      // But we can't do that query in Prisma easily.
      // So we update by the explicit variants found.
      
      for (const variant of variants) {
          if (variant === finalName) continue // Already correct
          
          const result = await prisma.barbershop.updateMany({
              where: {
                  city: variant 
              },
              data: {
                  city: finalName
              }
          })
          if (result.count > 0) {
             console.log(`Updated ${result.count} records from '${variant}' to '${finalName}'`)
          }
      }
  }

  console.log("✅ Cidades normalizadas com sucesso!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
