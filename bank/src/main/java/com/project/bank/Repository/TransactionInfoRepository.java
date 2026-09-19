package com.project.bank.Repository;

import com.project.bank.Utility.TransactionInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionInfoRepository extends JpaRepository<TransactionInfo, Long> {
}
