package com.captrack.backend.service;

import com.captrack.backend.model.Transaction;
import com.captrack.backend.model.User;
import com.captrack.backend.repository.TransactionRepository;
import com.captrack.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentAuthenticatedUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<Transaction> getAllTransactions() {
        User user = getCurrentAuthenticatedUser();
        return transactionRepository.findAllByUserOrderByDateDesc(user);
    }

    public Transaction getTransactionById(Long id) {
        User user = getCurrentAuthenticatedUser();
        return transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    @Transactional
    public Transaction createTransaction(Transaction transaction) {
        User user = getCurrentAuthenticatedUser();
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction updateTransaction(Long id, Transaction updatedTransaction) {
        Transaction existing = getTransactionById(id);
        existing.setType(updatedTransaction.getType());
        existing.setAmount(updatedTransaction.getAmount());
        existing.setCategory(updatedTransaction.getCategory());
        existing.setDate(updatedTransaction.getDate());
        existing.setDescription(updatedTransaction.getDescription());
        return transactionRepository.save(existing);
    }

    @Transactional
    public void deleteTransaction(Long id) {
        Transaction existing = getTransactionById(id);
        transactionRepository.delete(existing);
    }
}
