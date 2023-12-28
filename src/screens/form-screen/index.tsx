import { useState, useEffect } from 'react';
import { StyleSheet, Button, Image, TextInput, View, Text, Alert, Dimensions, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSuitcaseMedical, faStarOfLife, faImage, faCamera, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-native';

interface Medicamento {
    id: string;
    nome: string;
    funcao: string;
    imagem: string | null;
}
const { width, height } = Dimensions.get('window');

const generateUniqueId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export default function FormScreen() {

    const [medicamento, setMedicamento] = useState<Medicamento>({
        id: generateUniqueId(),
        nome: '',
        funcao: '',
        imagem: null,
    });
    const [isEditing, setIsEditing] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modaImage, setModaImage] = useState<string | null>(null);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setModaImage(null);
    };

    const isSalvarButtonDisabled = () => {
        return !medicamento.nome || !medicamento.funcao || !medicamento.imagem;
    };

    const [medicamentosSalvos, setMedicamentosSalvos] = useState<Medicamento[]>([]);

    useEffect(() => {
        loadMedicamentos();
    }, []);

    const loadMedicamentos = async () => {
        try {
            const savedMedicamentos = await AsyncStorage.getItem('medicamentos');
            if (savedMedicamentos) {
                setMedicamentosSalvos(JSON.parse(savedMedicamentos));
            }
        } catch (error) {
            console.error('Erro ao carregar medicamentos:', error);
        }
    };

    const saveMedicamentos = async (novosMedicamentos: Medicamento[]) => {
        try {
            await AsyncStorage.setItem('medicamentos', JSON.stringify(novosMedicamentos));
            setMedicamentosSalvos(novosMedicamentos);
        } catch (error) {
            console.error('Erro ao salvar medicamentos:', error);
        }
    };

    const pickImage = async (isCamera: boolean) => {
        let result: ImagePicker.ImagePickerResult;
        if (isCamera) {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        }

        if (!result.canceled) {
            setMedicamento({ ...medicamento, imagem: result.assets && result.assets[0]?.uri });
        }
    };

    const handleNomeChange = (text: string) => {
        setMedicamento({ ...medicamento, nome: text });
    };

    const handleFuncaoChange = (text: string) => {
        setMedicamento({ ...medicamento, funcao: text });
    };

    const handleSubmit = async () => {
        const novoMedicamento = { ...medicamento, id: generateUniqueId() };
        let novosMedicamentos;

        if (isEditing) {
            novosMedicamentos = medicamentosSalvos.map((med) =>
                med.id === medicamento.id ? { ...medicamento } : med
            );
        } else {
            novosMedicamentos = [...medicamentosSalvos, novoMedicamento];
        }

        await saveMedicamentos(novosMedicamentos);
        setMedicamento({ id: generateUniqueId(), nome: '', funcao: '', imagem: null });
        setIsEditing(false);
    };

    const handleEdit = (data: Medicamento) => {
        setMedicamento(data);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setMedicamento({
            id: generateUniqueId(),
            nome: '',
            funcao: '',
            imagem: null,
        });
        setIsEditing(false);
    };

    const handleExcluirMedicamento = async (id: string) => {
        Alert.alert(
            'Confirmação',
            'Tem certeza que deseja excluir este medicamento?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Confirmar',
                    onPress: async () => {
                        try {
                            const medicamentosAtualizados = medicamentosSalvos.filter(med => med.id !== id);
                            await saveMedicamentos(medicamentosAtualizados);
                        } catch (error) {
                            console.error('Erro ao excluir medicamento:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={{ flex: 1, gap: 20, marginBottom: 30, flexDirection: 'column', alignItems: 'center', width: width }}>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 30 }}>
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 8, backgroundColor: "#c2ffed77", borderRadius: 100 }}>
                    <FontAwesomeIcon icon={faStarOfLife} size={50} color="#00ffb3" />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text style={{ fontSize: 30, fontWeight: '800', color: "#3e3e3e" }}>Snap</Text>
                    <Text style={{ fontSize: 30, fontWeight: '800', color: "#00f7ad" }}>Info</Text>
                </View>
            </View>
            {medicamento.imagem && <Image source={{ uri: medicamento.imagem }} style={{ width: width - 50, height: 200, borderRadius: 5 }} />}

            <TextInput
                style={styles.input}
                placeholder="Nome do Medicamento"
                value={medicamento.nome}
                onChangeText={handleNomeChange}
            />
            <TextInput
                style={styles.input}
                placeholder="Função do Medicamento"
                value={medicamento.funcao}
                onChangeText={handleFuncaoChange}
            />
            <TouchableOpacity style={styles.button} onPress={() => pickImage(false)}>
                <FontAwesomeIcon size={30} color='#fff' icon={faImage} />
                <Text style={{ fontSize: 20, fontWeight: '800', color: "#fff" }}>Escolher uma imagem</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => pickImage(true)}>
                <FontAwesomeIcon size={30} color='#fff' icon={faCamera} />
                <Text style={{ fontSize: 20, fontWeight: '800', color: "#ffffff" }}>Tirar uma foto</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={isSalvarButtonDisabled()} style={[styles.button, { backgroundColor: isSalvarButtonDisabled() ? '#03a79433' : '#03a793' }]} onPress={handleSubmit}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: "#ffffff" }}>{isEditing ? 'Editar' : 'Salvar'}</Text>
            </TouchableOpacity>
            {
                isEditing && (
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#03a793' }]} onPress={handleCancelEdit}>
                        <Text style={{ fontSize: 20, fontWeight: '800', color: "#ffffff" }}>Cancelar</Text>
                    </TouchableOpacity>
                )
            }
            <Text style={{ marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>Medicamentos Salvos:</Text>
            {medicamentosSalvos.length === 0 ? (
                <>
                    <FontAwesomeIcon icon={faSuitcaseMedical} size={30} color="#808080" />
                    <Text style={{ fontSize: 16, marginTop: 10 }}>Nenhum medicamento cadastrado ainda.</Text>
                </>
            ) : (
                medicamentosSalvos.map((med, index) => (
                    <View key={index} style={styles.containerContent} >
                        {med.imagem && (
                            <>
                                <TouchableOpacity onPress={() => {
                                    setModaImage(med.imagem)
                                    openModal()
                                }
                                }>
                                    <Image source={{ uri: med.imagem }} style={{ width: 250, height: 200, borderRadius: 5 }} />
                                </TouchableOpacity>
                                <Modal
                                    visible={modalVisible}
                                    transparent={true}
                                    onRequestClose={closeModal}
                                >
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                                        <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20, padding: 10, backgroundColor: "#ffffff24", borderRadius: 100 }} onPress={closeModal}>
                                            <FontAwesomeIcon icon={faXmark} size={30} color='#fff' />
                                        </TouchableOpacity>
                                        <Image source={{ uri: modaImage }} style={{ width: '95%', height: 300, borderRadius: 5 }} />
                                    </View>
                                </Modal>
                            </>
                        )}
                        <Text style={{ fontSize: 25, fontWeight: '300', color: "#444444" }}>{`Nome: ${med.nome}`}</Text>
                        <Text style={{ fontSize: 25, fontWeight: '300', color: "#444444" }}>{`Função: ${med.funcao}`}</Text>
                        <View style={{ position: 'absolute', top: 10, right: 10, gap: 5 }}>
                            <TouchableOpacity
                                onPress={() => handleEdit(med)}>
                                <Text style={{ fontSize: 15, fontWeight: '400', color: "#444444" }}>EDITAR</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleExcluirMedicamento(med.id)}>
                                <Text style={{ fontSize: 15, fontWeight: '400', color: "#ff0000" }}>APAGAR</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}


        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 60,
        fontSize: 20,
        borderRadius: 5,
        paddingHorizontal: 10,
        width: width - 50,
        backgroundColor: '#e2e2e2'
    },
    button: {
        flexDirection: 'row',
        gap: 12,
        width: width - 50,
        backgroundColor: '#00f7ad',
        color: '#161616',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 5,
    },
    containerContent: {
        padding: 10,
        position: 'relative',
        width: width - 50,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#0000009a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    }
});
