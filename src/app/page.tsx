"use client";

import React, { useEffect, useState } from 'react';
import ContentWrapper from '@/components/layouts/ContentWrapper';
import { Box, Card, CardMedia, CardContent, Typography } from '@mui/material';

interface Dish {
  id: number,
  name: string
  description: string
}

export default function Home() {
  const [dishes, setDishes] = useState<Dish[]>([]);

  const getDishes = async () => {
    console.log("NEXT_PUBLIC_ENV: " + process.env.NEXT_PUBLIC_ENV)
    console.log("NEXT_PUBLIC_BACKEND_URL: " + process.env.NEXT_PUBLIC_BACKEND_URL)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dishes`);
    const json = await response.json();
    setDishes(json.data);
  }

  useEffect(() => {
    getDishes();
  }, []);

  console.log(dishes)

  return (
    <ContentWrapper>
      <>テスト</>
      {
        dishes.length === 0
          ? (<div>未登録</div>)
          : (dishes.map(dish => (
          <Box key={ dish.id } sx={{ p: 1 }}>
            <Card sx={{ display: "flex" }}>
              <CardMedia
                component="img"
                sx={{ height: 150, width: 150,  }}
                image="https://source.unsplash.com/random?wallpapers"
              />
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Typography component="div" variant="h5">
                    {dish.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" component="div">
                    {dish.description}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Box>
        )))
      }
    </ContentWrapper>
  );
}

