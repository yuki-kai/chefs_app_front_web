import { AppBar, Box, Button, Link, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href={"/"} underline="none" color="inherit">
            Chefs
          </Link>
        </Typography>
        <Box sx={{ flexGrow: 0 }}>
          <Button color="inherit">
            <Link href={"/recipes/create"} underline="none" color="inherit">
              レシピを投稿する
            </Link>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
