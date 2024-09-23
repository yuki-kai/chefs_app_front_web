"use client";

import React, { useEffect, useState } from 'react';
import ContentWrapper from '@/components/layouts/ContentWrapper';
import { Box, Card, CardMedia, CardContent, Typography } from '@mui/material';
import axios from "axios";
import { DishCard } from '@/types/dish.type';
import { useCookies } from 'next-client-cookies';
import { FlashMessage } from '@/components/commons/FlashMessage';
import { Severity } from '@/types/severity.type';

export default function Home() {
  const cookies = useCookies();
  const [dishes, setDishes] = useState<DishCard[]>([]);

  const fetchDishes = async () => {
    axios.get("/api")
      .then(dishes => setDishes(dishes.data))
      .catch(error => console.log(error))
  }

  useEffect(() => {
    fetchDishes();
  }, []);

  return (
    <ContentWrapper>
      {
        cookies.get(Severity.Success)
          ? <FlashMessage messageSeverity={ Severity.Success } message="レシピを追加しました。" />
          : null
      }
      {
        dishes.length === 0
          ? (<div>未登録</div>)
          : (dishes.map(dish => (
          <Box key={ dish.id } sx={{ p: 1 }}>
            <Card sx={{ display: "flex" }}>
              <CardMedia
                component="img"
                sx={{ height: 150, width: 150,  }}
                image={dish.image_path}
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

