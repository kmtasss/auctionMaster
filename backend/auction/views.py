from rest_framework.response import Response
from rest_framework import generics
from rest_framework.views import APIView
from .models import Lot
from .serializers import LotSerializer, BuyersLotsSerializer, NewBetSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
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
    permission_classes = (IsAuthenticated,)

    def put(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.creator == request.user:
            return Response({"error: Создатель не может участвовать в своем аукционе"}, status=403)

        if not instance.is_available:
            return Response({"error: Аукцион завершен"}, status=403)

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        bet = serializer.validated_data.get('bet', 50)

        if not bet or bet < 50:
            bet = 50

        instance.current_price += bet

        instance.current_buyer = request.user
        instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class BuyersLotsAPIList(generics.ListCreateAPIView):
    serializer_class = BuyersLotsSerializer

    def get_queryset(self):
        queryset = Lot.objects.filter(current_buyer=self.request.user)
        return queryset


class UserInfoView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        data = {
            'username': user.username,
        }
        return Response(data)
