# HOV Modern Editor

Reusable facebook-like editor component built based on @highoutput/ckeditor5 library

## Peer dependencies

in order to use this editor component, you must install or meet the following library versions

- "@chakra-ui/react": "^1.6.5",
- "@emotion/react": "^11.4.0",
- "@emotion/styled": "^11.3.0",
- "framer-motion": "^4.1.17",
- "react": ">=16",
- "react-dom": ">=16",
- "react-hook-form": "^7.11.0",
- "react-icons": "^4.2.0"

## Important note

you need to add this style on the global scope to make sure mention and emojis will work

```jsx
'.ck .ck-balloon-panel': {
  zIndex: 9999,
}
```

you also need to add this property in ChakraProvider if you will use this on top of your existing UI framework

```jsx
cssVarsRoot=".chakra-portal"
```