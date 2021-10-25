# https 浏览器自动升级请求

  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <script>
    if (location.protocol.startsWith('https:')) {
      document.write('<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">')
    }
  </script>

# https localhost
caddy_windows_amd64_custom.exe
caddy reverse-proxy --from localhost --to localhost:3000

[caddy_windows_amd64_custom.exe下载](https://caddyserver.com/download) 

使用 PowerShell CD 到该文件地址执行 .\caddy_windows_amd64_custom.exe  reverse-proxy --from localhost --to localhost:8085
