package kr.ac.ync.Movie.controller;

import kr.ac.ync.Movie.domain.Banner;
import kr.ac.ync.Movie.domain.Movie;
import kr.ac.ync.Movie.dto.BannerRequestDto;
import kr.ac.ync.Movie.dto.MovieRequestDto;
import kr.ac.ync.Movie.repository.BannerRepository;
import kr.ac.ync.Movie.repository.MovieRepository;
import kr.ac.ync.Movie.service.BannerService;
import kr.ac.ync.Movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final BannerRepository bannerRepository;
    private final MovieRepository movieRepository;

    private final MovieService movieService;
    private final BannerService bannerService;

    @GetMapping("/")
    public String index(Model model) {
        // 메인 배너 및 CTA 배너 조회
        model.addAttribute("mainBanners", bannerRepository.findByBannerTypeOrderBySortOrderAsc("MAIN"));
        model.addAttribute("ctaBanner", bannerRepository.findByBannerTypeOrderBySortOrderAsc("CTA"));

        // 인기 영화 목록 조회
        model.addAttribute("popularMovies", movieRepository.findByIsPopular(true));
        return "index"; // index.html로 전송
    }


    // Entity에 직접 때려넣기
//    @PostMapping("/api/movies")
//    @ResponseBody
//    public ResponseEntity<Movie> createMovie(@RequestBody Movie movie){
//        Movie savedMovie = movieRepository.save(movie);
//        return ResponseEntity.ok(savedMovie);
//    }
//    @PostMapping("/api/banners")
//    @ResponseBody
//    public ResponseEntity<Banner> createMovie(@RequestBody Banner banner){
//        Banner savedMovie = bannerRepository.save(banner);
//        return ResponseEntity.ok(savedMovie);
//    }
//
//    // [DTO -> Entity 변환 후 저장] 영화 등록 API
//    @PostMapping("/api/movies")
//    @ResponseBody
//    public ResponseEntity<Movie> createMovie(@RequestBody MovieRequestDto dto) { // 1. @RequestBody로 DTO 받기
//        Movie savedMovie = movieService.savedMovie(dto);
//        return ResponseEntity.ok(savedMovie);
//    }

    // [DTO -> Entity 변환 후 저장] 배너 등록 API
    @PostMapping("/api/banners")
    @ResponseBody
    public ResponseEntity<Banner> createBanner(@RequestBody BannerRequestDto dto) { // 1. @RequestBody로 DTO 받기
        Banner savedBanner = bannerService.savedBanner(dto);
        return ResponseEntity.ok(savedBanner);
    }

}