import { useState } from 'react'
import { ChakraProvider, Button, Box, Heading, Flex, Text, Image } from "@chakra-ui/react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <ChakraProvider>
      <Flex backgroundColor="#BFCDE0">
        <Box p="1rem" h="100vh" w="20rem" centerContent>
          <Box borderRadius="1rem" h="96vh" padding="1rem 1.5rem" background="linear-gradient(145deg, #3f375b, #352e4d)" color="#FEFCFD">
            <Flex p=".8rem 0" alignItems="center">
              <Image src='LOGO-UNSIL.png' alt='Logo UNSIL' w="3.3rem" mr="1rem"/>
              <Heading as="h1" size="xs">Sistem Monitoring<br/>Kualitas Udara</Heading>
            </Flex>
            
          </Box>
        </Box>
        <Box p="1rem" pl="0" flex="1">
          
          <Box w="100%" backgroundColor="#FEFCFD" p="1rem" borderRadius="1rem" mb="1rem">
            <Button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </Button>
            <p>
              Edit <code>src/App.jsx</code> and save to test HMR
            </p>
          </Box>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </Box>
      </Flex>
    </ChakraProvider>
  )
}

export default App
