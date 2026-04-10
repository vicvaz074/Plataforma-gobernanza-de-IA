async (page) => {
  const baseUrl = "http://localhost:3000"
  const outDir = "/Users/vicentevazquez/Desktop/Plataforma-gobernanza-de-IA-main/output/playwright/plataforma-capturas"

  await page.setViewportSize({ width: 1440, height: 1200 })
  await page.goto(`${baseUrl}/login`, { waitUntil: "domcontentloaded" })
  await page.waitForTimeout(1000)

  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("userRole", "admin")
    localStorage.setItem("userName", "Alicia Rivera")
    localStorage.setItem("userEmail", "alicia.rivera@davara.com.mx")
    localStorage.setItem("language", "es")
    localStorage.setItem("theme", "light")
    localStorage.setItem("sidebarCollapsed", "false")
    localStorage.setItem(
      "aiSystemsRegistry",
      JSON.stringify([
        {
          id: "x1",
          companyName: "Davara Governance",
          systemName: "Monitor de Cumplimiento IA",
          riskLevel: "alto",
          mainPurpose: "Monitoreo regulatorio",
          createdAt: new Date().toISOString(),
        },
      ]),
    )
    localStorage.setItem(
      "aiTechnicalDocuments",
      JSON.stringify([
        {
          id: "d1",
          name: "arquitectura.pdf",
          uploadDate: new Date().toISOString(),
        },
      ]),
    )
  })

  await page.goto(`${baseUrl}/registro-sistemas-ia`, { waitUntil: "domcontentloaded" })
  await page.waitForTimeout(4500)

  const text = await page.evaluate(() => document.body.innerText.slice(0, 1500))
  await page.screenshot({ path: `${outDir}/05-debug.png` })
  return text
}
