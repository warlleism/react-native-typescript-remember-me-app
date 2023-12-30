import { Image, View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSuitcaseMedical, faXmark, faArrowLeft, faStarOfLife, faEllipsisVertical, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-native';
import { Medicamento } from '../../interfaces/IMedicamentos'
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

interface RenderDataProps {
    contentSalvos: Medicamento[];
    setModaImage: React.Dispatch<React.SetStateAction<string | null>>;
    openModal: () => void;
    onPress: () => void;
    modalVisible: boolean;
    closeModal: () => void;
    modaImage: string | null;
    handleEdit: (data: Medicamento) => void;
    handleExcluirMedicamento: (id: string) => void;
}

export const RenderData: React.FC<RenderDataProps> = ({
    contentSalvos,
    setModaImage,
    openModal,
    onPress,
    modalVisible,
    closeModal,
    modaImage,
    handleEdit,
    handleExcluirMedicamento,
}) => {

    const [selectedMonth, setSelectedMonth] = useState<string>();
    return (
        <View style={{ paddingHorizontal: 10 }}>
            <View style={{ height: 100, width: width, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginBottom: 10 }}>
                <TouchableOpacity onPress={onPress} style={{ width: 50, height: 50, }} >
                    <FontAwesomeIcon icon={faArrowLeft} size={40} color='#1d1d1dcc' />
                </TouchableOpacity>
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, padding: 8, borderRadius: 100 }}>
                    <FontAwesomeIcon icon={faStarOfLife} size={40} color="#6200ff" />
                </View>
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 100 }} />
            </View>
            <View style={{ alignSelf: 'center', width: "100%", flexDirection: 'row', justifyContent: "space-between", marginBottom: 20 }}>
                <TextInput
                    placeholder='Buscar'
                    style={{
                        width: '64%',
                        paddingHorizontal: 10,
                        height: 70,
                        fontSize: 24,
                        borderWidth: 2,
                        borderColor: "#6200ff",
                        borderRadius: 5,
                    }}
                />
                <View style={{ width: '35%', height: 70, borderWidth: 2, borderColor: "#6200ff", borderRadius: 5 }}>
                    <Picker
                        selectedValue={selectedMonth}
                        onValueChange={(itemValue, itemIndex) =>
                            setSelectedMonth(itemValue)
                        }>
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="jan" value="1" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="fev" value="2" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="abr" value="3" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="mar" value="4" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="mai" value="5" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="jun" value="6" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="jul" value="7" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="ago" value="8" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="set" value="9" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="out" value="10" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="nov" value="11" />
                        <Picker.Item style={{ fontSize: 20, color: "#6200ff" }} label="dez" value="12" />
                    </Picker>
                </View>
            </View>

            {contentSalvos && Array.isArray(contentSalvos) && contentSalvos.length === 0 ? (
                <>
                    <FontAwesomeIcon icon={faSuitcaseMedical} size={30} color="#808080" />
                    <Text style={{ fontSize: 16, marginTop: 10 }}>Nenhum medicamento cadastrado ainda.</Text>
                </>
            ) : (
                contentSalvos?.map((med, index) => (
                    <View key={index} style={styles.containerContent} >
                        {med.imagem && (
                            <>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModaImage(med.imagem)
                                        openModal()
                                    }}>
                                    <Image source={{ uri: med.imagem }} style={{ width: '100%', height: 200, borderRadius: 5 }} />
                                </TouchableOpacity>
                                <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
                                    <View style={{ height: height, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                                        <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20, padding: 10, borderRadius: 100 }} onPress={closeModal}>
                                            <FontAwesomeIcon icon={faXmark} size={30} color='#fff' />
                                        </TouchableOpacity>
                                        <Image source={{ uri: modaImage || undefined }} style={{ width: '95%', height: 300, borderRadius: 5 }} />
                                    </View>
                                </Modal></>)}
                        <Text style={{ fontSize: 25, fontWeight: '500', color: "#444444" }}>{med.nome}</Text>
                        <Text style={{ fontSize: 17, fontWeight: '300', color: "#444444" }}>{med.funcao}</Text>
                        <Text style={{ fontSize: 15, marginTop: 10, letterSpacing: -1, fontWeight: '300', color: "#44444475" }}>{med.date}</Text>
                        <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10, right: 10, gap: 10 }}>
                            <TouchableOpacity onPress={() => handleEdit(med)}>
                                <FontAwesomeIcon icon={faPenToSquare} size={30} color='#1d1d1dcc' />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleExcluirMedicamento(med.id)}>
                                <FontAwesomeIcon icon={faTrashCan} size={30} color='#6200ff' />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
        </View>

    );
}

const styles = StyleSheet.create({
    containerContent: {
        width: '100%',
        marginBottom: 60,
        borderRadius: 5,
    }
});
