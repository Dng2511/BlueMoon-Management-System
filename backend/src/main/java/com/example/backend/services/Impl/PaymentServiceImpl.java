package com.example.backend.services.Impl;

import com.example.backend.dtos.ApartmentDTO;
import com.example.backend.dtos.PaymentDTO;
import com.example.backend.models.Fee;
import com.example.backend.models.Payment;
import com.example.backend.models.Resident;
import com.example.backend.models.Vehicle;
import com.example.backend.models.enums.VehicleType;
import com.example.backend.repositories.FeeRepository;
import com.example.backend.repositories.PaymentRepository;
import com.example.backend.repositories.ResidentRepository;
import com.example.backend.services.PaymentService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final ResidentRepository residentRepository;
    private final FeeRepository feeRepository;

    @Override
    public Page<PaymentDTO> findAll(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(PaymentDTO::fromEntity);
    }

    @Override
    public Page<PaymentDTO> findBy(Long userId, Pageable pageable) {
        return null;
    }

    @Override
    public PaymentDTO save(JsonNode data) {
        // Lấy thông tin người dân và phí từ dữ liệu
        Resident resident = residentRepository.findById(data.get("resident_id").asLong())
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        Fee fee = feeRepository.findById(data.get("fee_id").asLong())
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        Payment payment = new Payment();
        payment.setResident(resident);
        payment.setFee(fee);

        // Lấy số lượng từ dữ liệu, nếu không có thì mặc định là 1
        Integer quantity = data.get("quantity").asInt();

        // Nếu loại phí là "area", lấy diện tích của căn hộ
        if (Objects.equals(fee.getType(), "area")) {
            quantity = resident.getApartment().getArea();
        }


        // Thiết lập số lượng và số tiền đã thanh toán
        payment.setQuantity(quantity);
        payment.setAmountPaid(fee.getAmount()*quantity);





        // Lấy phương thức thanh toán từ dữ liệu, nếu không có thì mặc định là null
        String method = data.hasNonNull("payment_method") ? data.get("payment_method").asText() : null;

        // Thiết lập trạng thái thanh toán và ngày thanh toán
        if (method == null || method.trim().isEmpty()) { // Nếu phương thức thanh toán là null hoặc rỗng, đặt trạng thái là "not yet paid"
            payment.setStatus("not yet paid");
            payment.setDatePaid(null); // ngày mặc định
        } else { // Nếu có phương thức thanh toán, đặt trạng thái và ngày thanh toán
            payment.setStatus(method);
            payment.setDatePaid(LocalDate.now()); // hoặc bạn lấy từ dữ liệu nếu có
        }

        // Lưu payment vào cơ sở dữ liệu và trả về DTO
        return PaymentDTO.fromEntity(paymentRepository.save(payment));
    }

    @Override
    public PaymentDTO update(JsonNode data, Long id) {
        Resident resident = residentRepository.findById(data.get("resident_id").asLong())
                .orElseThrow(() -> new RuntimeException("Resident not found"));

        Fee fee = feeRepository.findById(data.get("fee_id").asLong())
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setResident(resident);
        payment.setFee(fee);
        Integer quantity = data.get("quantity").asInt();
        if (Objects.equals(fee.getType(), "area")) {
            quantity = resident.getApartment().getArea();
        }
        payment.setQuantity(quantity);
        payment.setAmountPaid(fee.getAmount()*quantity);

        String method = data.hasNonNull("payment_method") ? data.get("payment_method").asText() : null;

        if (method == null || method.trim().isEmpty()) {
            payment.setStatus("not yet paid");
            payment.setDatePaid(null); // ngày mặc định
        } else {
            payment.setStatus(method);
            if (payment.getDatePaid() == null) payment.setDatePaid(LocalDate.now());
        }
        return PaymentDTO.fromEntity(paymentRepository.save(payment));
    }

    @Override
    public void delete(Long id) {
        paymentRepository.deleteById(id);
    }


    @Override
    public void save(Fee fee, Resident resident) {
        Payment payment = new Payment();
        Integer quantity = 1;
        if (Objects.equals(fee.getType(), "area")) {
            quantity = resident.getApartment().getArea();
        }

        payment.setResident(resident);
        payment.setFee(fee);
        payment.setQuantity(quantity);

        payment.setStatus("not yet paid");
        payment.setDatePaid(null);
        if (Objects.equals(fee.getType(), "vehicle")) {
            payment.setQuantity(resident.getApartment().getVehicles().size());

            int amountPaid = 0;
            for (Vehicle vehicle : resident.getApartment().getVehicles()) {
                if(vehicle.getVehicleType() == VehicleType.CAR) amountPaid += 1200000;
                else amountPaid += 70000;
            }
            payment.setAmountPaid(amountPaid);
        } else {
            payment.setAmountPaid(fee.getAmount()*quantity);
        }
        if (payment.getQuantity() == 0) return;

        paymentRepository.save(payment);
    }

    @Override
    public Page<PaymentDTO> searchPayments(String search, Pageable pageable) {
        return paymentRepository.searchPayments(search, pageable)
                .map(PaymentDTO::fromEntity);
    }


}
