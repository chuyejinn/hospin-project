package com.example.hospin.repository;

import com.example.hospin.domain.entity.Reservation;
import com.example.hospin.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUser(User user);
}