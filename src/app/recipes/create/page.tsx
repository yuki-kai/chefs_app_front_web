"use client";

import { Box, Button, Container, FormControl, FormLabel, IconButton, Modal, Stack, TextField } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useRef, useState } from "react";
import style from "./page.module.css";
import Image from 'next/image';
import { CropperDialog } from "@/components/commons/CropperDialog";

function Create() {
  const [dishImage, setDishImage] = useState("");
  const [cropedImage, setCropedImage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [ingredients, setIngredients] = useState<{ name: string, amount: string }[]>([]);
  const [recipes, setRecipes] = useState<{ instruction: string }[]>([]);

  const addIngredientForm = () => {
    setIngredients([...ingredients, { name: "", amount: "" }]);
  };

  const updateIngredient = (key: string, index: number, value: string) => {
    setIngredients(ingredients.map((ingredient, ingredientIndex) => 
      ingredientIndex === index ? { ...ingredient, [key]: value } : ingredient
    ));
  };

  const deleteIngredientForm = (index: number) => {
    setIngredients(ingredients.filter(
      (_, ingredientIndex) => ingredientIndex !== index)
    );
  };

  const addRecipeForm = () => {
    setRecipes([...recipes, { instruction: "" }]);
  };

  const updateRecipe = (index: number, value: string) => {
    setRecipes(recipes.map((recipe, recipeIndex) => 
      recipeIndex === index ? { ...recipe, "instruction": value } : recipe
    ));
  };

  const deleteRecipeForm = (index: number) => {
    setRecipes(recipes.filter(
      (_, recipeIndex) => recipeIndex !== index)
    );
  };

  const input = useRef<HTMLInputElement>(null);

  const openSelectFileModal = () => {
    input!.current!.click();
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error("Event.target is null");
    };
    const files = event.target.files
    if (files == null || files?.length === 0) {
      throw new Error("Event.target.files is null");
    };
    setDishImage(URL.createObjectURL(files[0]));
    setIsOpen(true);
  };

  const onCropComplete = (url :string) => {
    setCropedImage(url)
  }

  return (
    <Container maxWidth="sm" sx={{ p: 5 }}>

      {/* 切り抜きモーダル */}
      <CropperDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        src={dishImage}
        onCropComplete={onCropComplete}
      />

      <Stack spacing={3}>
        <FormControl>
          <input
            onChange={handleFiles}
            type="file"
            accept=".png,.jpeg,.jpg"
            hidden
            ref={input}
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
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel component="legend">料理名</FormLabel>
          <TextField required />
        </FormControl>

        <FormControl>
          <FormLabel component="legend">概要</FormLabel>
          <TextField required multiline rows={4} />
        </FormControl>

        <FormControl>
          <FormLabel component="legend">材料</FormLabel>
          <Stack direction="row">
            <TextField
              placeholder="例: 醤油"
              sx={{ width: "65%" }}
              size="small"
              />
            <TextField
              placeholder="例: 大さじ1"
              sx={{ width: "30%" }}
              size="small"
            />
          </Stack>
          { ingredients.map(
            (ingredient, index) => (
              <Stack key={index} direction="row" sx={{ pt: 1 }}>
                <TextField
                  placeholder="材料"
                  sx={{ width: "65%" }}
                  size="small"
                  value={ingredient.name}
                  onChange={(event) => updateIngredient("name", index, event.target.value)}
                />
                <TextField
                  placeholder="分量"
                  sx={{ width: "30%" }}
                  size="small"
                  value={ingredient.amount}
                  onChange={(event) => updateIngredient("amount", index, event.target.value)}
                />
                <IconButton
                  onClick={() => deleteIngredientForm(index)}
                  sx={{ width: "5%" }}
                  size="small"
                >
                  <HighlightOffIcon fontSize="medium"/>
                </IconButton>
              </Stack>
            ))
          }
          <Button
            onClick={addIngredientForm}
            sx={{ mt: 1 }}
            color="primary"
            variant="outlined"
            size="small"
          >
            材料を追加
          </Button>
        </FormControl>

        <FormControl>
          <FormLabel component="legend">作り方</FormLabel>
          <Stack direction="row">
            <TextField
              placeholder="例: 玉ねぎを5ミリ幅に切る"
              sx={{ width: "95%" }}
              size="small"
              />
          </Stack>
          { recipes.map(
            (recipe, index) => (
              <Stack key={index} direction="row" sx={{ pt: 1 }}>
                <TextField
                  placeholder="作り方"
                  sx={{ width: "95%" }}
                  size="small"
                  value={recipe.instruction}
                  onChange={(event) => updateRecipe(index, event.target.value)}
                />
                <IconButton
                  onClick={() => deleteRecipeForm(index)}
                  sx={{ width: "5%" }}
                  size="small"
                >
                  <HighlightOffIcon fontSize="medium"/>
                </IconButton>
              </Stack>
            ))
          }
          <Button
            onClick={addRecipeForm}
            sx={{ mt: 1 }}
            color="primary"
            variant="outlined"
            size="small"
          >
            作り方を追加
          </Button>
        </FormControl>

        <Stack sx={{ pt: 5 }}>
          <Button color="primary" variant="contained" size="large">
            作成
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Create;
