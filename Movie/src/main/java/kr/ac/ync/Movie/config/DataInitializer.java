package kr.ac.ync.Movie.config;

import kr.ac.ync.Movie.domain.Banner;
import kr.ac.ync.Movie.domain.Movie;
import kr.ac.ync.Movie.repository.BannerRepository;
import kr.ac.ync.Movie.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final BannerRepository bannerRepository;
    private final MovieRepository movieRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. 순환 메인 배너 더미 데이터
        Banner b1 = new Banner();
        b1.setTitle("메인 배너 1");
        b1.setImageUrl("https://placehold.co/1200x400/000000/FFFFFF?text=Main+Banner+1");
        b1.setLinkUrl("#");
        b1.setBannerType("MAIN");
        b1.setSortOrder(1);
        bannerRepository.save(b1);

        Banner b2 = new Banner();
        b2.setTitle("메인 배너 2");
        b2.setImageUrl("https://placehold.co/1200x400/333333/FFFFFF?text=Main+Banner+2");
        b2.setLinkUrl("#");
        b2.setBannerType("MAIN");
        b2.setSortOrder(2);
        bannerRepository.save(b2);

        // 2. CTA 배너 더미 데이터
        Banner cta = new Banner();
        cta.setTitle("CTA 유도 배너");
        cta.setImageUrl("https://placehold.co/1200x200/555555/FFFFFF?text=CTA+Banner");
        cta.setLinkUrl("#");
        cta.setBannerType("CTA");
        cta.setSortOrder(1);
        bannerRepository.save(cta);

        // 3. 카드형 영화 데이터
        for (int i = 1; i <= 6; i++) {
            Movie movie = new Movie();
            movie.setTitle("인기 영화 " + i);
            movie.setPosterUrl("https://placehold.co/200x300/222222/FFFFFF?text=Movie+" + i);
            movie.setPopular(true);
            movieRepository.save(movie);
        }
    }
}