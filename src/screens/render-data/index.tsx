import { Image, View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSuitcaseMedical, faXmark, faArrowLeft, faStarOfLife, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-native';
import { Medicamento } from '../../interfaces/IMedicamentos'

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
    return (
        <ScrollView>

            <View style={{ height: 100, width: width, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
                <TouchableOpacity onPress={onPress} style={{ width: 50, height: 50, }} >
                    <FontAwesomeIcon icon={faArrowLeft} size={40} color='#1d1d1dcc' />
                </TouchableOpacity>
                <View style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, padding: 8, borderRadius: 100 }}>
                    <FontAwesomeIcon icon={faStarOfLife} size={40} color="#6200ff" />
                </View>
                <View style={{  display: 'flex', justifyContent: 'center', alignItems: 'center', width: 50, height: 50, borderRadius: 100 }}>
                    <FontAwesomeIcon size={40} color="#20202028" icon={faEllipsisVertical} />
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
                                <TouchableOpacity onPress={() => {
                                    setModaImage(med.imagem)
                                    openModal()
                                }}>
                                    <Image source={{ uri: med.imagem }} style={{ width: '100%', height: 200, borderRadius: 5 }} />
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
                                        <Image source={{ uri: modaImage || undefined }} style={{ width: '95%', height: 300, borderRadius: 5 }} />
                                    </View>
                                </Modal>
                            </>
                        )}
                        <Text style={{ fontSize: 25, fontWeight: '300', color: "#444444" }}>{`Título: ${med.nome}`}</Text>
                        <Text style={{ fontSize: 25, fontWeight: '300', color: "#444444" }}>{`Descrição: ${med.funcao}`}</Text>
                        <Text style={{ fontSize: 25, fontWeight: '300', color: "#444444" }}>{`Data: ${med.date}`}</Text>
                        <View style={{ position: 'absolute', bottom: 10, right: 10, gap: 5 }}>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    containerContent: {
        paddingHorizontal: 10,
        width: width,
        marginBottom: 20,
        borderRadius: 5,
        shadowColor: '#0000009a',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    }
});
