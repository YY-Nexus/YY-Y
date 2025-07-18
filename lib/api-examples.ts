/**
 * API示例代码库 - 提供多种编程语言的API调用示例
 */

// 网络测速API示例
export const speedTestExamples = {
  curl: `curl -X POST "https://api.nettrack.yyc3.tech/v1/network/test" \\
  -H "Content-Type: application/json" \\
  -d '{"server": "shanghai-1", "duration": 15}'`,

  javascript: `// 使用fetch API
fetch('https://api.nettrack.yyc3.tech/v1/network/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    server: 'shanghai-1',
    duration: 15
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('错误:', error));`,

  python: `import requests

response = requests.post(
    'https://api.nettrack.yyc3.tech/v1/network/test',
    json={
        'server': 'shanghai-1',
        'duration': 15
    }
)

print(response.json())`,

  java: `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.nettrack.yyc3.tech/v1/network/test"))
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\"server\":\"shanghai-1\",\"duration\":15}"
    ))
    .build();

HttpResponse<String> response = client.send(
    request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,

  csharp: `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

using (HttpClient client = new HttpClient())
{
    var content = new StringContent(
        "{\"server\":\"shanghai-1\",\"duration\":15}",
        Encoding.UTF8,
        "application/json");
        
    HttpResponseMessage response = await client.PostAsync(
        "https://api.nettrack.yyc3.tech/v1/network/test", 
        content);
        
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseBody);
}`,

  php: `<?php
$url = 'https://api.nettrack.yyc3.tech/v1/network/test';
$data = array(
    'server' => 'shanghai-1',
    'duration' => 15
);

$options = array(
    'http' => array(
        'header'  => "Content-type: application/json\r\n",
        'method'  => 'POST',
        'content' => json_encode($data)
    )
);

$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);

echo $result;
?>`,

  go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

func main() {
    postBody, _ := json.Marshal(map[string]interface{}{
        "server":   "shanghai-1",
        "duration": 15,
    })
    
    resp, err := http.Post(
        "https://api.nettrack.yyc3.tech/v1/network/test",
        "application/json",
        bytes.NewBuffer(postBody),
    )
    
    if err != nil {
        fmt.Println(err)
        return
    }
    
    defer resp.Body.Close()
    body, _ := ioutil.ReadAll(resp.Body)
    fmt.Println(string(body))
}`,
}

// 网络诊断API示例
export const networkDiagnosisExamples = {
  curl: `curl -X POST "https://api.nettrack.yyc3.tech/v1/network/diagnosis" \\
  -H "Content-Type: application/json" \\
  -d '{"target": "example.com", "diagnosticType": "完整"}'`,

  javascript: `// 使用fetch API
fetch('https://api.nettrack.yyc3.tech/v1/network/diagnosis', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    target: 'example.com',
    diagnosticType: '完整'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('错误:', error));`,

  python: `import requests

response = requests.post(
    'https://api.nettrack.yyc3.tech/v1/network/diagnosis',
    json={
        'target': 'example.com',
        'diagnosticType': '完整'
    }
)

print(response.json())`,
}

// 性能测试API示例
export const performanceTestExamples = {
  curl: `curl -X POST "https://api.nettrack.yyc3.tech/v1/performance/test" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com", "device": "desktop", "connection": "4g"}'`,

  javascript: `// 使用fetch API
fetch('https://api.nettrack.yyc3.tech/v1/performance/test', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://example.com',
    device: 'desktop',
    connection: '4g'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('错误:', error));`,

  python: `import requests

response = requests.post(
    'https://api.nettrack.yyc3.tech/v1/performance/test',
    json={
        'url': 'https://example.com',
        'device': 'desktop',
        'connection': '4g'
    }
)

print(response.json())`,
}

// 安全检测API示例
export const securityScanExamples = {
  curl: `curl -X POST "https://api.nettrack.yyc3.tech/v1/security/scan" \\
  -H "Content-Type: application/json" \\
  -H "X-API-KEY: your_api_key_here" \\
  -d '{"url": "https://example.com", "scanDepth": "标准", "includeCookies": false}'`,

  javascript: `// 使用fetch API
fetch('https://api.nettrack.yyc3.tech/v1/security/scan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': 'your_api_key_here'
  },
  body: JSON.stringify({
    url: 'https://example.com',
    scanDepth: '标准',
    includeCookies: false
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('错误:', error));`,

  python: `import requests

headers = {
    'X-API-KEY': 'your_api_key_here'
}

response = requests.post(
    'https://api.nettrack.yyc3.tech/v1/security/scan',
    headers=headers,
    json={
        'url': 'https://example.com',
        'scanDepth': '标准',
        'includeCookies': False
    }
)

print(response.json())`,
}

// 系统状态API示例
export const healthStatusExamples = {
  curl: `curl -X GET "https://api.nettrack.yyc3.tech/v1/health"`,

  javascript: `// 使用fetch API
fetch('https://api.nettrack.yyc3.tech/v1/health')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('错误:', error));`,

  python: `import requests

response = requests.get('https://api.nettrack.yyc3.tech/v1/health')
print(response.json())`,
}

// 用户反馈API示例
export const feedbackExamples = {
  curl: `curl -X POST "https://api.nettrack.yyc3.tech/v1/feedback" \\
  -F "name=张三" \\
  -F "email=zhangsan@example.com" \\
  -F "message=我发现了一个问题..." \\
  -F "category=错误报告" \\
  -F "attachments=@/path/to/screenshot.png"`,

  javascript: `// 使用FormData API
const formData = new FormData();
formData.append('name', '张三');
formData.append('email', 'zhangsan@example.com');
formData.append('message', '我发现了一个问题...');
formData.append('category', '错误报告');
formData.append('attachments', fileInput.files[0]);

fetch('https://api.nettrack.yyc3.tech/v1/feedback', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('错误:', error));`,

  python: `import requests

files = {
    'attachments': open('/path/to/screenshot.png', 'rb')
}

data = {
    'name': '张三',
    'email': 'zhangsan@example.com',
    'message': '我发现了一个问题...',
    'category': '错误报告'
}

response = requests.post(
    'https://api.nettrack.yyc3.tech/v1/feedback',
    data=data,
    files=files
)

print(response.json())`,
}

// 监控API示例
export const monitorExamples = {
  curl: `curl -X POST "https://api.nettrack.yyc3.tech/v1/monitor" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your_token_here" \\
  -d '{
    "targetUrl": "https://example.com",
    "interval": 5,
    "alertThresholds": {
      "responseTime": 2000,
      "availability": 99.9
    },
    "notificationChannels": [
      {
        "type": "email",
        "target": "alerts@example.com"
      },
      {
        "type": "wechat",
        "target": "wxid_12345"
      }
    ]
  }'`,

  javascript: `// 使用fetch API
fetch('https://api.nettrack.yyc3.tech/v1/monitor', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your_token_here'
  },
  body: JSON.stringify({
    targetUrl: 'https://example.com',
    interval: 5,
    alertThresholds: {
      responseTime: 2000,
      availability: 99.9
    },
    notificationChannels: [
      {
        type: 'email',
        target: 'alerts@example.com'
      },
      {
        type: 'wechat',
        target: 'wxid_12345'
      }
    ]
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('错误:', error));`,

  python: `import requests

headers = {
    'Authorization': 'Bearer your_token_here'
}

data = {
    'targetUrl': 'https://example.com',
    'interval': 5,
    'alertThresholds': {
        'responseTime': 2000,
        'availability': 99.9
    },
    'notificationChannels': [
        {
            'type': 'email',
            'target': 'alerts@example.com'
        },
        {
            'type': 'wechat',
            'target': 'wxid_12345'
        }
    ]
}

response = requests.post(
    'https://api.nettrack.yyc3.tech/v1/monitor',
    headers=headers,
    json=data
)

print(response.json())`,
}
