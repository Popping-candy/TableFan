using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using System.IO;
using System.Threading.Tasks;
public class Service : MonoBehaviour
{
    [SerializeField] private long _responseCode;
    public long responseCode { get { return _responseCode; } }
    public void setResponseCode(long code)
    {
        _responseCode = code;
    }
    [SerializeField] private string _responseText;
    public string responseText { get { return _responseText; } }
    [SerializeField] private long _beforeRequestTime;
    public long beforeRequestTime { get { return _beforeRequestTime; } }
    public string endpoint = "http://192.168.179.133:8000";
    public async void SendDeploymentReq(string address, byte[] req)
    {
        _beforeRequestTime = UnixNanoseconds();
        UnityWebRequest request = UnityWebRequest.Get(address);
        request.uploadHandler = (UploadHandler)new UploadHandlerRaw(req);
        request.SetRequestHeader("content-Type", "application/json");
        var operation = request.SendWebRequest();
        while (!operation.isDone)
            await Task.Yield();
        _responseCode = request.responseCode;
        _responseText = request.downloadHandler.text;
        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError(request.error);
        }
        else
        {
            Debug.Log(request.downloadHandler.text);
        }
    }


    public IEnumerator SendReq(string address, byte[] req)
    {
        UnityWebRequest request = UnityWebRequest.Get(address);
        request.uploadHandler = (UploadHandler)new UploadHandlerRaw(req);
        request.downloadHandler = (DownloadHandler)new DownloadHandlerBuffer();
        request.SetRequestHeader("content-Type", "application/json");
        request.SetRequestHeader("Accept", "application/json");
        request.SetRequestHeader("api-version", "0.1");
        yield return request.SendWebRequest();
        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError(request.error);
        }
        else
        {
            Debug.Log(request.downloadHandler.text);
        }
    }
    public byte[] ToByteArray(string json)
    {
        return new System.Text.UTF8Encoding().GetBytes(json);
    }
    long UnixNanoseconds()
    {
        System.DateTime unixStart = new System.DateTime(1970, 1, 1, 0, 0, 0, System.DateTimeKind.Utc);
        return (System.DateTime.UtcNow - unixStart).Ticks * 100;
    }
}


