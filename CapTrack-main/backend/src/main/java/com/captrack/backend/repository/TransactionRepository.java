package com.captrack.backend.repository;

import com.captrack.backend.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import com.captrack.backend.model.User;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findAllByUserOrderByDateDesc(User user);
    Optional<Transaction> findByIdAndUser(Long id, User user);
}
