using UnityEngine;
public class CreateDefaultTable : MonoBehaviour
{
    [SerializeField] private string endpoint = "http://192.168.179.133:8000";
    public Service service;
    void Start()
    {
        string deviceTable = System.IO.File.ReadAllText("Assets/Json/DeviceTable.json");
        StartCoroutine(service.SendReq($"{endpoint}/createDeviceTable", service.ToByteArray(deviceTable)));
    }
}
