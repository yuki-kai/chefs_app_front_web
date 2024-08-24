export type DishCard = {
  id: number,
  image_path: string
  name: string
  description: string
};

export type CreateDishRequest = {
  cropedImage: string,
  name: string,
  description: string,
  ingredients: Ingredient[],
  recipes: Recipe[]
};

export type Ingredient = {
  name: string,
  amount: string,
}

export type Recipe = {
  instruction: string,
}
