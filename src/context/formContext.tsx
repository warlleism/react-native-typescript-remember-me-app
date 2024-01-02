import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Medicamento } from '../interfaces/IMedicamentos';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';


const generateUniqueId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export interface ContentContextProps {
    content: Medicamento;
    setContent: React.Dispatch<React.SetStateAction<Medicamento>>;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    contentSalvos: Medicamento[];
    setContentSalvos: React.Dispatch<React.SetStateAction<Medicamento[]>>;
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    modaImage: string | null;
    setModaImage: React.Dispatch<React.SetStateAction<string | null>>;
    renderDataVisible: boolean;
    setRenderDataVisible: React.Dispatch<React.SetStateAction<boolean>>;
    openModal: () => void;
    closeModal: () => void;
    handleSubmit: () => void;
    handleExcluirMedicamento: (id: string) => void;
    showRenderData: () => void;
    handleEdit: (data: Medicamento) => void;
    handleCancelEdit: () => void;
    pickImage: (isCamera: boolean) => void;
    isSalvarButtonDisabled: () => void;
    savePhotos: (novosMedicamentos: Medicamento[]) => void;
}

export const ContentContext = createContext<ContentContextProps | null>(null);

interface ContentProviderProps {
    children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {

    const [content, setContent] = useState<Medicamento>({
        id: generateUniqueId(),
        nome: '',
        funcao: '',
        imagem: null,
        date: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [contentSalvos, setContentSalvos] = useState<Medicamento[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modaImage, setModaImage] = useState<string | null>(null);
    const [renderDataVisible, setRenderDataVisible] = useState(false);
    const navigation = useNavigation()

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModaImage(null);
    };

    useEffect(() => {
        loadMedicamentos();
    }, []);

    const loadMedicamentos = async () => {
        try {
            const savedMedicamentos = await AsyncStorage.getItem('photos');
            if (savedMedicamentos) {
                setContentSalvos(JSON.parse(savedMedicamentos));
            }
        } catch (error) {
            return
        }
    };

    const pickImage = async (isCamera: boolean) => {
        let result: ImagePicker.ImagePickerResult;
        if (isCamera) {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [3, 4],
                quality: 1,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [3, 4],
                quality: 1,
            });
        }
        if (!result.canceled) {
            setContent({ ...content, imagem: result.assets && result.assets[0]?.uri });
        }
    };


    const savePhotos = async (novosMedicamentos: Medicamento[]) => {
        try {
            novosMedicamentos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            await AsyncStorage.setItem('photos', JSON.stringify(novosMedicamentos));
            setContentSalvos(novosMedicamentos);
        } catch (error) {
            return
        }
    };

    const showRenderData = () => {
        setRenderDataVisible(true);
    };



    const handleSubmit = async () => {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "dd/MM/yyyy HH:mm", { locale: ptBR });
        const novoMedicamento = { ...content, id: generateUniqueId(), date: isEditing ? content.date : formattedDate };

        let novosMedicamentos;

        if (isEditing) {
            novosMedicamentos = contentSalvos.map((med) =>
                med.id === content.id ? { ...novoMedicamento } : med
            );
        } else {
            novosMedicamentos = [...contentSalvos, novoMedicamento];
        }

        await savePhotos(novosMedicamentos);
        setContent({
            id: generateUniqueId(), nome: '', funcao: '', imagem: null, date: ''
        });
        setIsEditing(false);
        navigation.navigate('AllData' as never)

    };

    const handleExcluirMedicamento = async (id: string) => {
        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja excluir este content?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        try {
                            const medicamentosAtualizados = contentSalvos.filter(med => med.id !== id);
                            await savePhotos(medicamentosAtualizados);
                        } catch (error) {
                            return
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleEdit = (data: Medicamento) => {
        setContent(data);
        setIsEditing(true);
        navigation.navigate('Home' as never)
    };

    const handleCancelEdit = () => {
        setContent({ id: generateUniqueId(), nome: '', funcao: '', imagem: null, date: '' });
        setIsEditing(false);
    };

    const isSalvarButtonDisabled = () => {
        return !content.nome || !content.funcao || !content.imagem;
    };

    const contextValue: ContentContextProps = {
        content,
        setContent,
        isEditing,
        setIsEditing,
        contentSalvos,
        setContentSalvos,
        modalVisible,
        setModalVisible,
        modaImage,
        setModaImage,
        renderDataVisible,
        setRenderDataVisible,
        openModal,
        closeModal,
        handleSubmit,
        handleCancelEdit,
        showRenderData,
        pickImage,
        handleEdit,
        handleExcluirMedicamento,
        savePhotos,
        isSalvarButtonDisabled
    };

    return (
        <ContentContext.Provider value={contextValue}>
            {children}
        </ContentContext.Provider>
    );
};
