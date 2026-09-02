package kr.ac.ync.Movie.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;   // 배너 이미지 경로
    private String linkUrl;    // 클릭 시 이동 링크
    private String title;      // 배너 제목 / 문구
    private String bannerType; // "MAIN" (순환 배너) 또는 "CTA" (CTA 배너)
    private Integer sortOrder; // 노출 순서
}