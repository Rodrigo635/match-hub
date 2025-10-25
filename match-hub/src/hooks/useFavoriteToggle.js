// hooks/useFavoriteToggle.js
import { useState, useCallback, useRef } from 'react';
import { toggleFavoriteGame, removeFavorite } from '../services/userService';
import { NotificationType } from '../types/NotificationType';

export const useFavoriteToggle = ({
    user,
    token,
    entityId,
    entityData,
    notificationType
}) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [loadingFavorite, setLoadingFavorite] = useState(false);
    const favoritesChecked = useRef(false);

    const getFavoritesArray = useCallback(() => {
        if (notificationType === NotificationType.TEAM) {
            return user?.favoriteTeams || [];
        }
        if (notificationType === NotificationType.CHAMPIONSHIP) {
            return user?.favoriteChampionships || [];
        }
        return user?.favoriteGames || [];
    }, [user, notificationType]);

    const checkFavorite = useCallback(() => {
        if (!user || !token || !entityId || favoritesChecked.current) return;

        try {
            const favorites = getFavoritesArray();
            const isFav = favorites.some(item => item.id === entityId) || false;
            setIsFavorite(isFav);
            favoritesChecked.current = true;
        } catch (error) {
            console.error("Erro ao verificar favorito:", error);
            setIsFavorite(false);
        }
    }, [user, token, entityId, getFavoritesArray]);

    const toggleFavorite = useCallback(async () => {
        if (!user || !token || !entityData) {
            alert("Você precisa estar logado para ativar notificações.");
            return;
        }

        try {
            setLoadingFavorite(true);

            if (isFavorite) {

                await removeFavorite(entityId, token, notificationType);
                setIsFavorite(false);

                if (notificationType === NotificationType.TEAM && user.favoriteTeams) {
                    user.favoriteTeams = user.favoriteTeams.filter(
                        item => item.id !== entityId
                    );
                } else if (notificationType === NotificationType.CHAMPIONSHIP && user.favoriteChampionships) {
                    user.favoriteChampionships = user.favoriteChampionships.filter(
                        item => item.id !== entityId
                    );
                } else if (notificationType === NotificationType.GAME && user.favoriteGames) {
                    user.favoriteGames = user.favoriteGames.filter(
                        item => item.id !== entityId
                    );
                }

                console.log("Favorito removido com sucesso");
            } else {

                await toggleFavoriteGame(entityId, token, notificationType);
                setIsFavorite(true);

                if (notificationType === NotificationType.TEAM) {
                    if (!user.favoriteTeams) user.favoriteTeams = [];
                    user.favoriteTeams.push(entityData);
                } else if (notificationType === NotificationType.CHAMPIONSHIP) {
                    if (!user.favoriteChampionships) user.favoriteChampionships = [];
                    user.favoriteChampionships.push(entityData);
                } else {
                    if (!user.favoriteGames) user.favoriteGames = [];
                    user.favoriteGames.push(entityData);
                }

                console.log("Favorito adicionado com sucesso");
            }
        } catch (error) {
            console.error("Erro ao alternar notificações:", error);
            alert("Erro ao alternar notificações. Tente novamente.");
        } finally {
            setLoadingFavorite(false);
        }
    }, [isFavorite, entityId, entityData, token, user, notificationType]);

    return {
        isFavorite,
        loadingFavorite,
        checkFavorite,
        toggleFavorite
    };
};