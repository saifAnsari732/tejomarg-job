Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('i:\Tejomarg-Job\public\job1.png')
$bmp = new-object System.Drawing.Bitmap 192, 192
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($img, 0, 0, 192, 192)
$bmp.Save('i:\Tejomarg-Job\app\icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save('i:\Tejomarg-Job\app\apple-icon.png', [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose()
$bmp.Dispose()
$img.Dispose()
