// Fill out your copyright notice in the Description page of Project Settings.


#include "MyBlueprintFunctionLibrary.h"
#include "Kismet/KismetSystemLibrary.h"
#include "Http.h"
#include "Interfaces/IHttpRequest.h"
#include "Json.h"
void UMyBlueprintFunctionLibrary::http_post(int mode)
{
	if (!FHttpModule::Get().IsHttpEnabled())
	{
		UE_LOG(LogTemp, Error, TEXT("HTTP module is not enabled!"));
		return;
	}
	TSharedPtr<IHttpRequest, ESPMode::ThreadSafe> Request = FHttpModule::Get().CreateRequest();
	Request->SetVerb("POST");
	Request->SetHeader(TEXT("Content-Type"), TEXT("application/json"));
	//begin
	FString filePath;
	switch (mode)
	{
	case 0:
		Request->SetURL("http://192.168.137.162:8000/fans");
		filePath = FPaths::ProjectContentDir() + TEXT("off.json");
		break;
	case 1:
		Request->SetURL("http://192.168.137.162:8000/fans");
		filePath = FPaths::ProjectContentDir() + TEXT("on.json");
		break;
	case 10:
		Request->SetURL("http://192.168.137.162:8000/createDeviceTable");
		filePath = FPaths::ProjectContentDir() + TEXT("DeviceTable.json");
		break;
	case 20:
		Request->SetURL("http://192.168.137.162:8000/CreateEffect/fan");
		filePath = FPaths::ProjectContentDir() + TEXT("effect_off.json");
		break;
	case 21:
		Request->SetURL("http://192.168.137.162:8000/CreateEffect/fan");
		filePath = FPaths::ProjectContentDir() + TEXT("effect_on.json");
		break;
	default:

		break;
	}
	//end
	if (!FPaths::FileExists(filePath))
	{
		UE_LOG(LogTemp, Error, TEXT("File Path:%s ,File do not exist"), *filePath);
		return;
	}
	FString ContentStr;
	if (!FFileHelper::LoadFileToString(ContentStr, *filePath))
	{
		UE_LOG(LogTemp, Error, TEXT("File Path:%s ,File Load failed"), *filePath);
		return;
	}
	GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Yellow, ContentStr);
	Request->SetContentAsString(ContentStr);
	if (Request->ProcessRequest())
	{
		GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Yellow, TEXT("succeed"));
	}
	else
	{
		GEngine->AddOnScreenDebugMessage(-1, 5.f, FColor::Yellow, TEXT("failed"));
	}
}