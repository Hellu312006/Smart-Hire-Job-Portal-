package com.smarthire.repository;

import com.smarthire.entity.Job;
import com.smarthire.entity.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    Page<Job> findByCompanyId(Long companyId, Pageable pageable);

    Page<Job> findByCompanyRecruiterId(Long recruiterId, Pageable pageable);

    List<Job> findByCompanyRecruiterId(Long recruiterId);

    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    long countByStatus(JobStatus status);

    long countByCompanyRecruiterId(Long recruiterId);

    long countByCompanyRecruiterIdAndStatus(Long recruiterId, JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND (" +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.company.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
           "(:minSalary IS NULL OR j.maxSalary >= :minSalary) AND " +
           "(:maxSalary IS NULL OR j.minSalary <= :maxSalary)" +
           ")")
    Page<Job> searchJobs(@Param("keyword") String keyword,
                         @Param("location") String location,
                         @Param("minSalary") BigDecimal minSalary,
                         @Param("maxSalary") BigDecimal maxSalary,
                         Pageable pageable);
}
