from rest_framework import serializers
from drf_extra_fields.fields import Base64ImageField
from .models import Lot


class LotSerializer(serializers.ModelSerializer):
    creator = serializers.HiddenField(default=serializers.CurrentUserDefault())
    image = Base64ImageField()
    current_buyer = serializers.SerializerMethodField()

    class Meta:
        model = Lot
        exclude = ('is_available',)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['creator'] = instance.creator.username
        return data

    def get_current_buyer(self, obj):
        if obj.current_buyer:
            return obj.current_buyer.username
        return None


class NewBetSerializer(serializers.Serializer):
    bet = serializers.IntegerField(required=False)

    def to_representation(self, instance):
        data = {'current_price': instance.current_price, 'current_buyer': instance.current_buyer.username}
        return data


class BuyersLotsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lot
        fields = '__all__'
