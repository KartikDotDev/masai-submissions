import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { Link } from "react-router";

function Header() {

  return (
    <Flex justify={"space-between"} p={4} bg="teal.500" color={'white'} >
      <Heading size={'md'}>Mini Notes App </Heading>
      <Flex gap={3}>
        <Link to={'/'}>DashBoard</Link>
        <Link to={'/about'}>About</Link>
        <Button size={'sm'} onClick={()=> console.log('clicked')}>Toggle Theme </Button>

      </Flex>
    </Flex>
  )
}

export default Header;
