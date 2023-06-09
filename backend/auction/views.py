from django.shortcuts import render
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import generics
from .models import Lot
from django.contrib.auth.models import User
from .serializers import LotSerializer, BuyersLotsSerializer, NewBetSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .permissions import IsAdminOrReadOnly, IsOwnerOrReadOnly


class ActiveLotsAPIList(generics.ListCreateAPIView):
    queryset = Lot.objects.filter(is_available=True)
    serializer_class = LotSerializer
    permission_classes = (IsAuthenticatedOrReadOnly, )


class LotAPIUpdate(generics.RetrieveUpdateAPIView):
    queryset = Lot.objects.all()
    serializer_class = LotSerializer
    permission_classes = (IsOwnerOrReadOnly, )


class LotAPIDestroy(generics.RetrieveDestroyAPIView):
    queryset = Lot.objects.all()
    serializer_class = LotSerializer
    permission_classes = (IsAdminOrReadOnly, )


class NewBetInLotUpdate(generics.RetrieveUpdateAPIView):
    queryset = Lot.objects.filter(is_available=True)
    serializer_class = NewBetSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.creator == request.user:
            return Response({"error: The user cannot perform this action"}, status=403)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance.current_price += serializer.validated_data.get('bet', 50)

        instance.current_buyer = request.user
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class BuyersLotsAPIList(generics.ListCreateAPIView):
    serializer_class = BuyersLotsSerializer

    def get_queryset(self):
        queryset = Lot.objects.filter(current_buyer=self.request.user)
        return queryset


