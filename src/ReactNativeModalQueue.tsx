import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useContext,
} from 'react';
import Modal, {ModalProps as RNModalProps} from 'react-native-modal';

type ModalProps = {
  children: ReactNode;
} & Partial<RNModalProps>;

interface ModalQueueContextProps {
  addModal: (modal: ModalProps) => void;
  closeModal: () => void;
}

const ModalQueueContext = React.createContext<
  ModalQueueContextProps | undefined
>(undefined);

export const ModalQueueProvider = ({children}: {children: ReactNode}) => {
  const [modalQueue, setModalQueue] = useState<ModalProps[]>([]);
  const [currentModal, setCurrentModal] = useState<ModalProps | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    if (isTransitioning) {
      return;
    }

    if (modalQueue.length > 0) {
      setCurrentModal(modalQueue[0]);
      setIsModalVisible(true);
    } else {
      setCurrentModal(null);
      setIsModalVisible(false);
    }
  }, [modalQueue, isTransitioning]);

  const addModalToQueue = useCallback((modal: ModalProps) => {
    setModalQueue(prevQueue => [...prevQueue, modal]);
  }, []);

  /**
   * NOTE:
   * 1. set isModalVisible to false to hide modal
   * 2. set isTransitioning to true to prevent modalQueue useEffect from running
   * 3. remove modal from queue in onModalHide
   *  */
  const closeModal = useCallback(() => {
    setIsTransitioning(true);
    setIsModalVisible(false);
  }, []);

  return (
    <ModalQueueContext.Provider
      value={{addModal: addModalToQueue, closeModal: closeModal}}>
      {children}
      {currentModal && (
        <Modal
          {...currentModal}
          isVisible={isModalVisible}
          onBackdropPress={() => {
            currentModal?.onBackdropPress?.();
            closeModal();
          }}
          onBackButtonPress={() => {
            currentModal?.onBackButtonPress?.();
            closeModal();
          }}
          onModalHide={() => {
            setModalQueue(prevQueue => prevQueue.slice(1));
            setIsTransitioning(false);
          }}>
          {currentModal.children}
        </Modal>
      )}
    </ModalQueueContext.Provider>
  );
};

export const useModalQueue = (): ModalQueueContextProps => {
  const context = useContext(ModalQueueContext);
  if (!context) {
    throw new Error('useModalQueue must be used within a ModalQueueProvider');
  }
  return context;
};
