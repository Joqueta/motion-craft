param([int]$Port = 8080)

$root = $PSScriptRoot
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Host "Portfolio servi sur http://localhost:$Port/"
Write-Host "Tests sur http://localhost:$Port/tests/index.html"
Write-Host "Ctrl+C pour arreter."

$types = @{
  ".html" = "text/html; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
  ".txt"  = "text/plain; charset=utf-8"
  ".xml"  = "application/xml; charset=utf-8"
}

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $path = [System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath)
    $file = Join-Path $root ($path.TrimStart('/') -replace '/', '\')

    if ($path -eq "/" -or (Test-Path $file -PathType Container)) {
      $file = Join-Path $file "index.html"
    }

    if (-not (Test-Path $file -PathType Leaf)) {
      $file = Join-Path $root "index.html"
    }

    try {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $extension = [System.IO.Path]::GetExtension($file).ToLower()
      $context.Response.ContentType = if ($types.ContainsKey($extension)) { $types[$extension] } else { "application/octet-stream" }
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } catch {
      $context.Response.StatusCode = 500
    }

    $context.Response.Close()
  }
} finally {
  $listener.Stop()
}
