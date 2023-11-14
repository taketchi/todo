import AppBar from "@mui/material/AppBar"
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Todo from './todo'

export default function Home() {
  return (
      <>
          <AppBar color="default">
              <Toolbar>
                  <Typography variant="h6" color="inherit" noWrap>
                        Todo
                  </Typography>
              </Toolbar>
          </AppBar>
          <Container maxWidth="sm">
              <Box sx={{
                  boxShadow: "0px 2px 4px -1px rgba(0,0,0,0.2)," +
                             "0px 4px 5px 0px rgba(0,0,0,0.14)," +
                             "0px 1px 10px 0px rgba(0,0,0,0.12)",
                  marginTop: "80px"}} >
                  <Todo />
              </Box>
          </Container>
      </>

  )
}
