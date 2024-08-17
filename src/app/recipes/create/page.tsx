"use client";

import { Box, Button, Container, FormControl, FormHelperText, FormLabel, IconButton, Stack, TextField } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import React, { useRef, useState } from "react";
import style from "./page.module.css";
import Image from 'next/image';
import { CropperDialog } from "@/components/commons/CropperDialog";
import axios from "axios";
import { redirect } from 'next/navigation'
import { useForm, useFieldArray } from "react-hook-form";

function Create() {
  const [originalImage, setOriginalImage] = useState("");
  const [cropedImage, setCropedImage] = useState("");
  const [uploadImage, setUploadImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<{
    cropedImage: string,
    name: string,
    description: string,
    ingredients: {
      name: string,
      amount: string,
    }[],
    recipes: {
      instruction: string;
    }[]
  }>({
    defaultValues: {
      ingredients: [{ name: "", amount: "" }],
      recipes: [{ instruction: "" }],
    },
  });

  const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
    name: "ingredients",
    control: control,
  });

  const { fields: recipeFields, append: appendInstruction, remove: removeInstruction } = useFieldArray({
    name: "recipes",
    control: control,
  });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const openSelectFileModal = () => {
    inputRef!.current!.click();
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error("Event.target is null");
    };
    const files = event.target.files
    if (files == null || files?.length === 0) {
      throw new Error("Event.target.files is null");
    };
    setOriginalImage(URL.createObjectURL(files[0]));
    setIsModalOpen(true);
  };

  const { ref, ...rest } = register('cropedImage', { onChange: handleFiles });

  const onCropComplete = (url :string, base64 :string) => {
    setCropedImage(url)
    setUploadImage(base64)
  }

  const onSubmit = async (values: any) => {
    const data = {
      base64: uploadImage,
      name: values.name,
      description: values.description,
      ingredients: values.ingredients,
      recipes: values.recipes,
    };
    axios.post("/api/create", data)
      .then(() => {
        console.log("成功")
      })
      .catch(error => console.log(error))
  }

  return (
    <Container maxWidth="sm" sx={{ p: 5 }}>

      {/* 切り抜きモーダル */}
      <CropperDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        targetImage={originalImage}
        onCropComplete={onCropComplete}
      />

      <Stack spacing={3}>
        <FormControl>
          <input
            type="file"
            accept=".png,.jpeg,.jpg"
            hidden
            ref={(element) => {
              ref(element)
              inputRef.current = element
            }}
            {...rest}
          />
          <Box textAlign='center'>
            {cropedImage
              ? <Image
                  onClick={openSelectFileModal}
                  src={cropedImage} className={style.img} width={300} height={300} alt=""
                />
              : <Button
                  onClick={openSelectFileModal}
                  variant="outlined"
                  sx={{ height: "300px",  width: "300px" }}
                >
                  料理写真
                </Button>
            }
            <FormHelperText error={errors.cropedImage ? true : false}>
              { errors.cropedImage?.message ?? "" }
            </FormHelperText>
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel component="legend">料理名</FormLabel>
          <TextField
            error={errors.name ? true : false}
            { ...register("name", {
                required: "入力してください",
                maxLength: { value: 20, message: "20文字以内で入力してください" }
              }
            )}
          />
          <FormHelperText error={errors.name ? true : false} sx={{ m: 0 }}>
            { errors.name?.message ?? "" }
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel component="legend">概要</FormLabel>
          <TextField
            multiline
            rows={4}
            error={errors.description ? true : false}
            // helperText={errors.description?.message ?? ""}
            { ...register("description", {
                required: "入力してください",
                maxLength: { value: 100, message: "100文字以内で入力してください" }
              }
            )}
          />
          <FormHelperText error={errors.description ? true : false} sx={{ m: 0 }}>
            { errors.description?.message ?? "" }
          </FormHelperText>
        </FormControl>

        <FormControl>
          <Stack direction="row">
            <FormLabel component="legend" sx={{ width: "65%" }}>材料</FormLabel>
            <FormLabel component="legend">分量</FormLabel>
          </Stack>
          { ingredientFields.map(
            (ingredient, index) => (
              <React.Fragment key={index}>
                <Stack direction="row">
                  <TextField
                    placeholder="しょうゆ"
                    sx={{ width: "64%", mr: "1%" }}
                    size="small"
                    error={errors.ingredients?.[index] ? true : false}
                    {...register(`ingredients.${index}.name`, {
                      required: "入力してください",
                      maxLength: { value: 100, message: "100文字以内で入力してください" }
                    })}
                  />
                  <TextField
                    placeholder="大さじ1杯"
                    sx={{ width: "30%" }}
                    size="small"
                    error={errors.ingredients?.[index] ? true : false}
                    {...register(`ingredients.${index}.amount`, {
                      required: "入力してください",
                      maxLength: { value: 10, message: "10文字以内で入力してください" }
                    })}
                  />
                  <IconButton
                    onClick={() => removeIngredient(index)}
                    disabled={ingredientFields.length <= 1}
                    sx={{ width: "5%" }}
                    size="small"
                  >
                    <HighlightOffIcon fontSize="medium"/>
                  </IconButton>
                </Stack>
                <Stack direction="row" sx={{ pb: 1 }}>
                  <FormHelperText error={errors.ingredients?.[index] ? true : false} sx={{ width: "65%", m: 0 }}>
                    { errors.ingredients?.[index]?.name?.message ?? "" }
                  </FormHelperText>
                  <FormHelperText error={errors.ingredients?.[index] ? true : false} sx={{ width: "30%", m: 0 }}>
                    { errors.ingredients?.[index]?.amount?.message ?? "" }
                  </FormHelperText>
                </Stack>
              </React.Fragment>
            ))
          }
          <Button onClick={() => appendIngredient({ name: "", amount: "" })} sx={{ mt: 1 }} color="primary" variant="outlined" size="small">
            材料を追加
          </Button>
        </FormControl>

        <FormControl>
          <FormLabel component="legend">作り方</FormLabel>
          { recipeFields.map((field, index) => (
            <React.Fragment key={index}>
              <Stack direction="row">
                <TextField
                  placeholder="作り方"
                  sx={{ width: "95%" }}
                  size="small"
                  multiline
                  rows={2}
                  error={errors.recipes?.[index] ? true : false}
                  {...register(`recipes.${index}.instruction`, {
                    required: "入力してください",
                    maxLength: { value: 100, message: "100文字以内で入力してください" }
                  })}
                />
                <IconButton
                  onClick={() => removeInstruction(index)}
                  disabled={recipeFields.length <= 1}
                  sx={{ width: "5%" }}
                  size="small"
                >
                  <HighlightOffIcon fontSize="medium"/>
                </IconButton>
              </Stack>
              <Stack direction="row" sx={{ pb: 1 }}>
                <FormHelperText error={errors.recipes?.[index] ? true : false} sx={{ m: 0 }}>
                  { errors.recipes?.[index]?.instruction?.message ?? "" }
                </FormHelperText>
              </Stack>
            </React.Fragment>
          ))}
          <Button onClick={() => appendInstruction({ instruction: "" })} sx={{ mt: 1 }} color="primary" variant="outlined" size="small">
            作り方を追加
          </Button>
        </FormControl>

        <Stack sx={{ pt: 5 }}>
          <Button onClick={handleSubmit(onSubmit)} color="primary" variant="contained" size="large">
            作成
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Create;
