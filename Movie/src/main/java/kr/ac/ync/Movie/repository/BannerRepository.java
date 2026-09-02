package kr.ac.ync.Movie.repository;

import kr.ac.ync.Movie.domain.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByBannerTypeOrderBySortOrderAsc(String bannerType);
}
