<?php require_once 'framework.php'; ?>
<?php get_header('Swedish | Now Studying | Sleepless Demo', 'question-page'); ?>
	<section id="front" class="card one-sided-card">
		<div class="card-front fade-in">
			<span class="card-field">Vilken färg är din nya datorn?</span>
		</div>
	</section>
	<section id="back">
		<form method="post" action="answer3.php" class="is-muted">
			<span class="input-btn mega-btn" id="study-show-answer"><input type="submit" name="show-answer" value="Show Answer" /></span>
		</form>
		
		<div class="study-status">
			<span class="study-time">2:12</span> 
			<span class="study-progress">7/23</span> 
		</div>
	</section>
<?php get_footer('study'); ?>