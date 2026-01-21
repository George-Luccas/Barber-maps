Write-Host "=== Automatização Bubblewrap Android ===" -ForegroundColor Cyan

# 1. Verificar se o servidor está rodando
$port = 3000
Write-Host "Verificando se o servidor local está rodando na porta $port..."
$tcpConnection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if (-not $tcpConnection) {
    Write-Host "Servidor não detectado. Iniciando 'npm run dev' em uma nova janela..." -ForegroundColor Yellow
    Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Minimized
    Write-Host "Aguardando 15 segundos para o servidor subir..."
    Start-Sleep -Seconds 15
} else {
    Write-Host "Servidor detectado na porta $port." -ForegroundColor Green
}

# 2. Inicializar Bubblewrap (Interativo)
# O usuário precisa interagir para configurar o JDK/Android SDK na primeira vez
Write-Host "Iniciando 'bubblewrap init'. Siga as instruções na tela..." -ForegroundColor Cyan
Write-Host "NOTA: Se perguntar a URL do manifesto, use: http://localhost:3000/manifest.json" -ForegroundColor Magenta
Write-Host "NOTA: Pressione CTRL+C se quiser cancelar a qualquer momento." -ForegroundColor Gray

# Usamos cmd /c para garantir que o npx rode corretamente no PowerShell
# O comando é interativo, então ele vai usar o terminal atual
cmd /c "npx -y @bubblewrap/cli init --manifest=http://localhost:3000/manifest.json"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Inicialização concluída. Iniciando build..." -ForegroundColor Green
    cmd /c "npx -y @bubblewrap/cli build"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build concluído! O APK deve estar na pasta atual." -ForegroundColor Green
    } else {
        Write-Host "Erro durante o build." -ForegroundColor Red
    }
} else {
    Write-Host "Erro durante a inicialização ou cancelado pelo usuário." -ForegroundColor Red
}

Write-Host "Processo finalizado. Pressione Enter para sair."
Read-Host
