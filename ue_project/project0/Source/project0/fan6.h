// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "fan6.generated.h"

UCLASS()
class PROJECT0_API Afan6 : public AActor
{
	GENERATED_BODY()
	
public:
	UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "YourCategory")
		int32 is_rotating = 0;
public:	
	// Sets default values for this actor's properties
	Afan6();
	UPROPERTY(VisibleAnywhere)
	UStaticMeshComponent* VisualMesh;
protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;
	float CurrentTime = 0.0f;
	float speed = 0, aspeed = 300, target = 600;

public:	
	// Called every frame
	virtual void Tick(float DeltaTime) override;
};
