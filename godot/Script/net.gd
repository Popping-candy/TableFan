extends CanvasLayer
var url = "http://192.168.137.162:8000/createDeviceTable"
var headers = [
	"Content-Type: application/json",
	"Accept: application/json",
	"api-version: 0.1"
	]

func _ready():
	$Button.connect("pressed",self,"_on_Button_pressed")
	$Button2.connect("pressed",self,"_on_Button2_pressed")
	$HTTPRequest1.connect("request_completed",self,"_on_HTTPRequest1_request_completed")

func _on_HTTPRequest1_request_completed(result, response_code, headers, body):
	print(response_code)
	if response_code == 200:
		var body_str = decode_body(body)
		print(body_str)
		$output.text = body_str + "\n"
	else:
		print("Failed")
		$output.text="Failed"

func _on_Button_pressed():
	var file = File.new()
	var json_data
	var json_content
	if file.open("res://json/DeviceTable.json", File.READ) == OK:
		json_content = file.get_as_text()
		file.close()
	else:
		print("无法打开文件")
	$HTTPRequest1.request(url, headers, true, HTTPClient.METHOD_POST, json_content)

func _on_Button2_pressed():
	var inputLayer = load("res://inputLayer.tscn")
	var inputDialog = inputLayer.instance()
	add_child(inputDialog)


func decode_body(body):
	var byte_array = PoolByteArray(body)
	var body_str = byte_array.get_string_from_ascii()
	return body_str
