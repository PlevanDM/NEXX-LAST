# PowerShell script to copy logo SVG file
$sourcePath = "C:\Users\dmitr\OneDrive\Робочий стіл\image_8e6a49a6-42b5-42da-8092-d03c16ebdafd.svg"
$destPath = "C:\NEXX_APP\public\static\nexx-logo.svg"

if (Test-Path $sourcePath) {
    Copy-Item $sourcePath $destPath -Force
    Write-Host "Logo copied successfully to: $destPath"
} else {
    Write-Host "Source file not found: $sourcePath"
    # Try to find the file
    $desktopPath = [Environment]::GetFolderPath("Desktop")
    $files = Get-ChildItem -Path $desktopPath -Filter "*.svg" -ErrorAction SilentlyContinue
    if ($files) {
        Write-Host "Found SVG files on desktop:"
        $files | ForEach-Object { Write-Host "  - $($_.FullName)" }
    }
}
