package com.captrack.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Transaction type is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type; // INCOME or EXPENSE

    @NotNull(message = "Amount is required")
    @PositiveOrZero(message = "Amount must be zero or positive")
    @Column(nullable = false)
    private BigDecimal amount;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category; // e.g. Cost of Goods, Operating Expenses, Marketing, Client Revenue

    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(length = 500)
    private String description;

    public Transaction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
