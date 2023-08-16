# react-native-queued-modals
Manage your React Native modals with ease using a queue system.

## Introduction
`react-native-queued-modals` was developed to address a challenge with `react-native-modal`: managing multiple modals. When displaying several modals, developers had to rely on the `onModalHide` callback. This becomes particularly cumbersome if there are multiple modals with various display combinations. With our queue system, you can effortlessly add and manage multiple modals.

## Installation
```bash
npm install react-native-queued-modals --save
```
or if you use Yarn:

```bash
yarn add react-native-queued-modals
```

## Usage

### Basic Usage


1. Wrap your App with ModalQueueProvider:
   
This provider gives access to the modal queue context to the rest of your app.

```javascript
import { ModalQueueProvider } from 'react-native-queued-modals';

function App() {
  return (
    <ModalQueueProvider>
      {/* Rest of your app components */}
    </ModalQueueProvider>
  );
}

```

2. Use the useModalQueue hook in your components:

This hook provides two functions: addModal and closeModal.
```javascript
import { useModalQueue } from 'react-native-queued-modals';

function SomeComponent() {
  const { addModal, closeModal } = useModalQueue();

  const handleButtonClick = () => {
    addModal({
      children: <YourModalContentComponent />,
      // Other react-native-modal props (optional)
    });
  };

  return <Button onPress={handleButtonClick} title="Show Modal" />;
}

```

3. Close the modal:

Once you've shown a modal using addModal, you can close it by invoking the closeModal function.

```javascript
function YourModalContentComponent() {
  const { closeModal } = useModalQueue();

  return (
    <>
      <Text>Hello from modal!</Text>
      <Button onPress={closeModal} title="Close" />
    </>
  );
}

```
### Handling Multiple Modals
In more complex scenarios, you might want to display another modal from an already open modal. Here's how you can seamlessly achieve this with react-native-queued-modals.

1. Open the initial modal:
```javascript
function SomeComponent() {
  const { addModal } = useModalQueue();

  const handleClickTestModal = () => {
    addModal({
      children: (
        <Box flex={1} bgColor="white" p={2}>
          <VStack space={2}>
            <Button onPress={handleShowAnotherModal}>
              Show Another Modal
            </Button>
            <Button onPress={closeModal}>
              Close Modal
            </Button>
          </VStack>
        </Box>
      ),
    });
  };

  return <Button onPress={handleClickTestModal} title="Show Test Modal" />;
}

```
2. Display a second modal from the open modal:
```javascript
function handleShowAnotherModal() {
  closeModal();
  addModal({
    children: (
      <Box flex={1} bgColor="white" p={2}>
        <Button onPress={closeModal}>
          Close This Modal
        </Button>
      </Box>
    ),
  });
}
```
By utilizing the queue system, this flow ensures that modals are presented in the order they were added, providing an intuitive user experience.



## Features
* Queue system: If multiple modals are added before the previous ones are closed, they will be presented in the order they were added.
* Extends `react-native-modal`: All the props and behaviors you love from `react-native-modal` can be passed through the addModal function.

## Notes
* `useModalQueue` must be used within a component that's a child of `ModalQueueProvider`. If not, it will throw an error.
* Modals are automatically removed from the queue when they're closed.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.