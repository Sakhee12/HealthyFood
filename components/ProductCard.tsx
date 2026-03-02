import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ProductCardProps {
    name: string;
    weight: string;
    price: string;
    image: string;
    rating: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    name,
    weight,
    price,
    image,
    rating
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                {/* Using a placeholder character for image since we don't have real assets */}
                <Text style={styles.placeholderImage}>{image}</Text>
            </View>

            <View style={styles.details}>
                <View style={styles.badges}>
                    <View style={styles.timeBadge}>
                        <Ionicons name="timer-outline" size={10} color="#666" />
                        <Text style={styles.badgeText}>13 MINS</Text>
                    </View>
                </View>

                <Text style={styles.name} numberOfLines={2}>{name}</Text>
                <Text style={styles.weight}>{weight}</Text>

                <View style={styles.footer}>
                    <View>
                        <Text style={styles.price}>{price}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={10} color={Colors.healthy.yellow} />
                            <Text style={styles.ratingValue}>{rating}</Text>
                        </View>
                    </View>
                    <Pressable style={styles.addButton}>
                        <Text style={styles.addButtonText}>ADD</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.healthy.white,
        borderRadius: 12,
        width: 156,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        overflow: 'hidden',
    },
    imageContainer: {
        height: 140,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderImage: {
        fontSize: 70,
    },
    details: {
        padding: 8,
    },
    badges: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    timeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 2,
    },
    badgeText: {
        fontSize: 8,
        fontWeight: '800',
        color: '#666',
    },
    name: {
        fontSize: 13,
        fontWeight: '600',
        color: '#222',
        height: 34,
        lineHeight: 17,
        marginBottom: 2,
    },
    weight: {
        fontSize: 11,
        color: '#777',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 13,
        fontWeight: '700',
        color: '#000',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    ratingValue: {
        fontSize: 10,
        fontWeight: '600',
        color: '#666',
    },
    addButton: {
        backgroundColor: Colors.healthy.white,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.healthy.successGreen,
        shadowColor: Colors.healthy.successGreen,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    addButtonText: {
        fontSize: 12,
        fontWeight: '900',
        color: Colors.healthy.successGreen,
    },
});
