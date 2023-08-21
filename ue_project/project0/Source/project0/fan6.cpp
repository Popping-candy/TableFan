// Fill out your copyright notice in the Description page of Project Settings.


#include "fan6.h"
#include "HttpModule.h"
#include "Kismet/KismetSystemLibrary.h"
#include "Http.h"
#include "Interfaces/IHttpRequest.h"

// Sets default values
Afan6::Afan6()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;
	VisualMesh = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Mesh"));
	VisualMesh->SetupAttachment(RootComponent);

	static ConstructorHelpers::FObjectFinder<UStaticMesh> CubeVisualAsset(TEXT("/Script/Engine.StaticMesh'/Game/fan/pCylinder3_group6.pCylinder3_group6'"));

	if (CubeVisualAsset.Succeeded())
	{
		VisualMesh->SetStaticMesh(CubeVisualAsset.Object);
		VisualMesh->SetRelativeLocation(FVector(0.0f, 0.0f, 0.0f));
	}
}

// Called when the game starts or when spawned
void Afan6::BeginPlay()
{
	Super::BeginPlay();
	UKismetSystemLibrary::PrintString(this, "(UKismetSystemLibrary::PrintString)   Hello world!");
}

// Called every frame
void Afan6::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);
	FRotator NewRotation = GetActorRotation();
	if (is_rotating == 0)
	{
		if(speed > 0)
			speed -= aspeed * DeltaTime;
		if (speed < 0)
			speed = 0;
	}
	else
	{
		if (speed < target)
			speed += aspeed * DeltaTime;
		if (speed > target)
			speed = target;
	}
	float DeltaRotation = DeltaTime * speed;
	NewRotation.Yaw = 0;
	NewRotation.Roll += DeltaRotation;
	NewRotation.Pitch = 0;
	SetActorRotation(NewRotation);
}