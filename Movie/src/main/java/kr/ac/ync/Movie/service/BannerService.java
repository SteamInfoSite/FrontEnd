package kr.ac.ync.Movie.service;

import kr.ac.ync.Movie.domain.Banner;
import kr.ac.ync.Movie.dto.BannerRequestDto;
import kr.ac.ync.Movie.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    @Transactional
    public Banner savedBanner(BannerRequestDto dto) {
        Banner banner = dto.toEntity(); // DTO -> Entity 변환
        return bannerRepository.save(banner);
    }
}