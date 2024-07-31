import type { ReactNode } from 'react';
import Container from '@mui/material/Container';

export default function ContentWrapper({children}: { children: ReactNode }) {
  return (
    <Container fixed>
      {children}
    </Container>
  );
}
