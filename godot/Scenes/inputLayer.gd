extends Control

var url = "http://192.168.137.162:8000/CreateEffect/fan"
var headers = [
	"Content-Type: application/json",
	"Accept: application/json",
	"api-version: 0.1"
	]
var output

func _ready():
	$btn_submit.connect("pressed", self, "_onSubmit")
	$HTTPRequest.connect("request_completed",self,"_on_request_completed")

func _onSubmit():
	var control = $LineEdit2.text
	var level = int($LineEdit4.text)
	var file = File.new()
	var json_str			#json=string
	var json_data = {}		#字典
	if file.open("res://json/Haptic_effect.json", File.READ) == OK:
		json_str = file.get_as_text()
		json_data = JSON.parse(json_str).result
		file.close()
	else:
		print("无法打开文件")
	json_data["control"]=control
	json_data["description"]["properties"]["quantity"]=level
	json_str=JSON.print(json_data)
	print(json_str)
	output = get_node("../output")
	output.text += json_data["deviceId"] + "\n"
	output.text += json_data["control"] + "\n"
	output.text += json_data["category"] + "\n"
	output.text += json_data["description"]["properties"]["type"] + "\n"
	$HTTPRequest.request(url, headers, true, HTTPClient.METHOD_POST, json_str)
	
func _on_request_completed(result, response_code, headers, body):

	print(response_code)
	if response_code==200:
		print("CreateEffect_Succssd")
		output.text+="CreateEffect_Succssd\n"
	else:
		print("CreateEffect_Failed")
		output.text += "CreateEffect_Failed"
	queue_free()
	


